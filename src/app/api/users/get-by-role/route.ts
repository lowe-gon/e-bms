import { ROLES, type UserRole } from '@/constants/user-role';
import database from '@/database';
import { sectorTable, userTable } from '@/database/schema';
import { parseRequestQueryParams } from '@/lib/parse-api-request';
import { badRequest, ok, serverError } from '@/lib/response';
import { tryCatch } from '@/lib/try-catch';
import { getApiMetadata } from '@/lib/utils';
import { withRole } from '@/lib/with-role';
import type { TUserWithSector } from '@/typings';
import { and, asc, countDistinct, desc, eq, ilike, or } from 'drizzle-orm';

export const GET = withRole([ROLES.CAPTAIN, ROLES.SECRETARY], async (request) => {
  const {
    filters: { search },
    pagination: { limit, offset, page },
    sorting: { sortOrder },
    raw,
  } = parseRequestQueryParams(request);
  const role = raw.get('role') as UserRole;

  const isAsc = sortOrder === 'asc';
  const sortDirection = isAsc ? asc : desc;
  const orderByClauses = sortDirection(userTable.createdAt);

  const searchFilter = search
    ? or(
        ilike(userTable.firstName, `%${search}%`),
        ilike(userTable.lastName, `%${search}%`),
        ilike(userTable.role, `%${search}%`),
      )
    : undefined;

  const whereCondition = and(searchFilter, eq(userTable.role, role));

  try {
    const [result, resultError] = await tryCatch(
      database.transaction(async (tx) => {
        const result = await tx
          .select({ count: countDistinct(userTable.id) })
          .from(userTable)
          .leftJoin(sectorTable, eq(sectorTable.assignedCouncilorId, userTable.id))
          .where(whereCondition);

        const total = result?.[0]?.count ?? 0;

        const users = await tx
          .select()
          .from(userTable)
          .leftJoin(sectorTable, eq(sectorTable.assignedCouncilorId, userTable.id))
          .where(whereCondition)
          .orderBy(orderByClauses)
          .offset(offset)
          .limit(limit);

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
      return ok<null>(null, 'No users found');
    }

    const formattedUser: TUserWithSector[] = result.users.map(({ users, sectors }) => ({
      ...users,
      sectors: sectors || null,
    }));
    return ok<TUserWithSector[]>(
      formattedUser,
      'Successfully get all users with sector',
      getApiMetadata({ page, limit, pageSize: formattedUser.length, totalItems: result.total }),
    );
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'An unknown error occured');
  }
});
