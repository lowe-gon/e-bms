import { STATUS_CODE } from '@/constants/http-status-code';
import database from '@/database';
import { userTable } from '@/database/schema';
import { withAuth } from '@/helpers/with-auth';
import { parseQueryParams } from '@/lib/parse-query';
import { withCatch } from '@/lib/try-catch';
import type { ResponseData, Users } from '@/typings';
import { asc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const GET = withAuth(async (req): Promise<NextResponse<ResponseData<Users[] | null>>> => {
  const { raw } = parseQueryParams(req);
  const role = raw.get('role');

  try {
    const [data, error] = await withCatch(
      database
        .select()
        .from(userTable)
        .where(eq(userTable.role, role as Users['role']))
        .orderBy(asc(userTable.created_at)),
    );

    if (error) {
      return NextResponse.json(
        {
          data: null,
          message: `Failed to get user by role: ${error.message}`,
          metadata: null,
          success: false,
        },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    return NextResponse.json(
      {
        data: data,
        message: 'Successfully get user by role',
        metadata: null,
        success: true,
      },
      { status: STATUS_CODE.OK },
    );
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        message: error instanceof Error ? error.message : 'An unknown error occured',
        metadata: null,
        success: false,
      },
      { status: STATUS_CODE.SERVER_ERROR },
    );
  }
});
