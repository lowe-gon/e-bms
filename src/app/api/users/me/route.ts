import { STATUS_CODE } from '@/constants/http-status-code';
import database from '@/database';
import { withAuth } from '@/helpers/with-auth';
import { withCatch } from '@/lib/try-catch';
import type { ResponseData, Users } from '@/typings';
import { NextResponse } from 'next/server';

export const GET = withAuth(
  async (_req, userId): Promise<NextResponse<ResponseData<Users | null>>> => {
    const [user, error] = await withCatch(
      database.query.userTable.findFirst({
        where: {
          clerkId: userId,
        },
      }),
    );

    if (error) {
      return NextResponse.json(
        { success: false, message: 'Failed to get user by id', metadata: null, data: null },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User profile not found', metadata: null, data: null },
        { status: STATUS_CODE.NOT_FOUND },
      );
    }

    return NextResponse.json(
      { success: true, message: 'Successfully get user by id', data: user, metadata: null },
      { status: 200 },
    );
  },
);
