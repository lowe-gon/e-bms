import database from '@/database';
import { unauthorized } from '@/lib/response';
import type { TUsers } from '@/typings';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { tryCatch } from './try-catch';

export function withAuth(
  handler: (req: NextRequest, user: NonNullable<TUsers>) => Promise<NextResponse>,
) {
  return async function (req: NextRequest) {
    const { userId, isAuthenticated } = await auth();

    if (!isAuthenticated) {
      return unauthorized('Unauthorized: No active session found.');
    }

    const [user, error] = await tryCatch(
      database.query.userTable.findFirst({
        where: {
          clerkId: userId,
        },
      }),
    );

    if (!user) {
      return unauthorized(error?.message ?? 'User not found');
    }

    return handler(req, user);
  };
}
