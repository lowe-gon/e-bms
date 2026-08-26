import { STATUS_CODE } from '@/constants/http-status-code';
import database from '@/database';
import { userTable } from '@/database/schema';
import { withAuth } from '@/helpers/with-auth';
import { parseQueryParams } from '@/lib/parse-query';
import { withCatch } from '@/lib/try-catch';
import type { ResponseData, Users } from '@/typings';
import { count } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const GET = withAuth(async (req) => {
  const { pagination } = parseQueryParams(req);

  const [queryResult, error] = await withCatch(
    Promise.all([
      database.query.userTable.findMany({
        limit: pagination.limit,
        offset: pagination.offset,
        orderBy: (userTable, { asc }) => [asc(userTable.created_at)],
      }),
      database.select({ count: count() }).from(userTable),
    ]),
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: STATUS_CODE.BAD_REQUEST });
  }

  const [data, countResult] = queryResult;
  const totalItems = countResult[0]?.count || 0;
  const totalPages = Math.ceil(totalItems / pagination.limit);

  const result: ResponseData<Users[]> = {
    metadata: {
      limit: pagination.limit,
      page: pagination.page,
      pageSize: data.length || 0,
      totalPages: totalPages,
    },
    data: data ? data : [],
  };

  return NextResponse.json(result, { status: STATUS_CODE.OK });
});
