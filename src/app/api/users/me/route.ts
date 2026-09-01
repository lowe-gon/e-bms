import database from '@/database';
import { badRequest, ok, serverError } from '@/lib/response';
import { tryCatch } from '@/lib/try-catch';
import { withRole } from '@/lib/with-role';
import type { TUserWithSector } from '@/typings';
import type { ApiResponse } from '@/typings/api.types';
import { NextResponse } from 'next/server';

export const GET = withRole(
  '*',
  async (request, currentUser): Promise<NextResponse<ApiResponse<TUserWithSector | null>>> => {
    try {
      const [userData, userError] = await tryCatch(
        database.query.userTable.findFirst({
          where: {
            clerkId: currentUser.clerkId,
          },
          with: {
            sectors: {
              where: {
                id: currentUser.id,
              },
            },
          },
        }),
      );

      if (userError || !userData) {
        return badRequest(userError?.message);
      }

      const formattedUser = {
        ...userData,
        sectors: userData.sectors[0] ?? null,
      } as TUserWithSector;

      return ok<TUserWithSector>(formattedUser, 'Successfully get user');
    } catch (error) {
      return serverError(error instanceof Error ? error.message : 'An unknown error');
    }
  },
);
