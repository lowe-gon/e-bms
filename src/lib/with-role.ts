import type { UserRole } from '@/constants/user-role';
import { forbidden } from '@/lib/response';
import { withAuth } from '@/lib/with-auth';
import type { TUsers } from '@/typings';
import { NextRequest, NextResponse } from 'next/server';

export function withRole(
  roles: UserRole | UserRole[] | '*',
  handler: (req: NextRequest, user: NonNullable<TUsers>) => Promise<NextResponse>,
) {
  return withAuth(async (request, user) => {
    if (roles === '*') {
      return handler(request, user);
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(user.role)) {
      return forbidden('You do not have access to this resource');
    }

    return handler(request, user);
  });
}
