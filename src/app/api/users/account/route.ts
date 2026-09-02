import { ROLES } from '@/constants/user-role';
import database from '@/database';
import { sectorTable, userTable } from '@/database/schema';
import {
  ZAccountFormSchema,
  ZUpdateAccountFormSchema,
} from '@/features/accounts/schemas/account-form.schema';
import { parseRequestJsonSchema, parseRequestQueryParams } from '@/lib/parse-api-request';
import { badRequest, created, ok, serverError } from '@/lib/response';
import { tryCatch } from '@/lib/try-catch';
import { base64ToFile, getApiMetadata } from '@/lib/utils';
import { withRole } from '@/lib/with-role';
import type { TUsers, TUserWithSector } from '@/typings';
import type { ApiResponse } from '@/typings/api.types';
import { clerkClient } from '@clerk/nextjs/server';
import { asc, count, desc, eq, ilike, or, type AnyColumn } from 'drizzle-orm';
import type { NextResponse } from 'next/server';

const ALLOWED_SORT_COLUMNS = new Set(['createdAt', 'role']);

// Get all user
export const GET = withRole(
  [ROLES.CAPTAIN, ROLES.SECRETARY],
  async (request): Promise<NextResponse<ApiResponse<TUserWithSector[] | null>>> => {
    const {
      pagination: { limit, page, offset },
      filters: { search },
      sorting: { sortBy, sortOrder },
    } = parseRequestQueryParams(request);

    const sortColumns = Array.isArray(sortBy) ? sortBy : [sortBy];

    const isAsc = sortOrder === 'asc';
    const sortDirection = isAsc ? asc : desc;
    const validSortColumns = sortColumns.filter(
      (col): col is keyof typeof userTable =>
        typeof col === 'string' && ALLOWED_SORT_COLUMNS.has(col),
    );

    const orderByClauses =
      validSortColumns.length > 0
        ? validSortColumns.map((col) => sortDirection(userTable[col] as AnyColumn))
        : [desc(userTable.createdAt)];
    const searchFilter = search
      ? or(ilike(userTable.firstName, `%${search}%`), ilike(userTable.lastName, `%${search}%`))
      : undefined;

    try {
      const [result, resultError] = await tryCatch(
        database.transaction(async (tx) => {
          const result = await tx.select({ count: count() }).from(userTable).where(searchFilter);

          const total = result?.[0]?.count ?? 0;

          const users = await tx
            .select()
            .from(userTable)
            .where(searchFilter)
            .orderBy(...orderByClauses)
            .offset(offset)
            .limit(limit)
            .leftJoin(sectorTable, eq(sectorTable.assignedCouncilorId, userTable.id));

          return {
            users,
            total,
          };
        }),
      );

      if (resultError) {
        return badRequest(`Failed to get all user with sector: ${resultError.message}`);
      }

      if (!result || result.users.length === 0) {
        return ok<TUserWithSector[]>([], 'No users found');
      }

      const formattedUser: TUserWithSector[] = result.users.map(({ users, sectors }) => ({
        ...users,
        sectors: sectors || null,
      }));

      return ok<TUserWithSector[]>(
        formattedUser,
        'Successfully update user',
        getApiMetadata({ page, limit, pageSize: formattedUser.length, totalItems: result.total }),
      );
    } catch (error) {
      return serverError(error instanceof Error ? error.message : 'An unknown error occured');
    }
  },
);

// Create new user
export const POST = withRole(
  [ROLES.CAPTAIN, ROLES.SECRETARY],
  async (request): Promise<NextResponse<ApiResponse<TUsers | null>>> => {
    const parsedSchema = await parseRequestJsonSchema(request, ZAccountFormSchema);

    if (!parsedSchema.success) {
      return parsedSchema.response;
    }

    const { emailAddress, firstName, lastName, password, phoneNumber, role, username, image } =
      parsedSchema.data;

    let formattedFile: File | null = null;

    if (image) {
      formattedFile = base64ToFile(image);
    }

    try {
      const client = await clerkClient();
      const [clerkUser, clerkUserError] = await tryCatch(
        client.users.createUser({
          firstName,
          lastName,
          username,
          password,
        }),
      );

      if (clerkUserError) {
        return badRequest(`Failed to create clerk user: ${clerkUserError.message}`);
      }

      if (formattedFile) {
        const [, clerkUpdateImageError] = await tryCatch(
          client.users.updateUserProfileImage(clerkUser.id, {
            file: formattedFile,
          }),
        );

        if (clerkUpdateImageError) {
          return badRequest(
            `Failed to update clerk profile image: ${clerkUpdateImageError.message}`,
          );
        }
      }

      const [user, userError] = await tryCatch<TUsers[]>(
        database
          .update(userTable)
          .set({
            role,
            emailAddress,
            phoneNumber,
          })
          .where(eq(userTable.clerkId, clerkUser.id)),
      );

      if (userError) {
        return badRequest(`Failed to update user role: ${userError.message}`);
      }

      if (!user) {
        return badRequest('No user found');
      }

      return ok<TUsers>(user[0]!, 'Successfully update user');
    } catch (error) {
      return serverError(error instanceof Error ? error.message : 'An unknown error occured');
    }
  },
);

// Update user
export const PUT = withRole(
  [ROLES.CAPTAIN, ROLES.SECRETARY],
  async (request): Promise<NextResponse<ApiResponse<TUsers | null>>> => {
    const { raw } = parseRequestQueryParams(request);
    const userId = raw.get('userId') as string;

    const parsedSchema = await parseRequestJsonSchema(request, ZUpdateAccountFormSchema);

    if (!parsedSchema.success) {
      return parsedSchema.response;
    }

    const { emailAddress, firstName, lastName, phoneNumber, role, image } = parsedSchema.data;

    let formattedFile: File | null = null;

    if (image && !image.startsWith('https://')) {
      formattedFile = base64ToFile(image);
    }

    try {
      const client = await clerkClient();
      const [clerkUser, clerkUserError] = await tryCatch(
        client.users.updateUser(userId, {
          firstName,
          lastName,
        }),
      );

      if (clerkUserError) {
        return badRequest(`Failed to update clerk user: ${clerkUserError.message}`);
      }

      if (formattedFile) {
        const [, clerkUpdateImageError] = await tryCatch(
          client.users.updateUserProfileImage(clerkUser.id, {
            file: formattedFile,
          }),
        );

        if (clerkUpdateImageError) {
          return badRequest(
            `Failed to update clerk profile image: ${clerkUpdateImageError.message}`,
          );
        }
      }

      const [user, userError] = await tryCatch<TUsers[]>(
        database
          .update(userTable)
          .set({
            role,
            emailAddress,
            phoneNumber,
          })
          .where(eq(userTable.clerkId, clerkUser.id)),
      );

      if (userError) {
        return badRequest(`Failed to update user role: ${userError.message}`);
      }

      if (!user) {
        return badRequest('No user found');
      }

      return created<TUsers>(user[0]!);
    } catch (error) {
      return serverError(error instanceof Error ? error.message : 'An unknown error occured');
    }
  },
);

// Delete user
export const DELETE = withRole(
  [ROLES.CAPTAIN, ROLES.SECRETARY],
  async (request): Promise<NextResponse<ApiResponse<null>>> => {
    const { raw } = parseRequestQueryParams(request);
    const userId = raw.get('userId') as string;

    try {
      const client = await clerkClient();
      const [, clerkUserError] = await tryCatch(client.users.deleteUser(userId));

      if (clerkUserError) {
        return badRequest(`Failed to delete clerk user: ${clerkUserError.message}`);
      }

      return ok<null>(null, 'Successfully delete user');
    } catch (error) {
      return serverError(error instanceof Error ? error.message : 'An unknown error occured');
    }
  },
);
