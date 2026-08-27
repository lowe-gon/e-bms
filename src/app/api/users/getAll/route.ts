import { STATUS_CODE } from '@/constants/http-status-code';
import database from '@/database';
import { userTable } from '@/database/schema';
import { withAuth } from '@/helpers/with-auth';
import { parseQueryParams } from '@/lib/parse-query';
import { withCatch } from '@/lib/try-catch';
import type { ResponseData, Users } from '@/typings';
import { asc, count, desc, ilike, or, type AnyColumn } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const ALLOWED_SORT_COLUMNS = new Set(['created_at', 'role']);

export const GET = withAuth(async (req) => {
  const {
    pagination: { limit, page, offset },
    filters: { search },
    sorting: { sortBy, sortOrder },
  } = parseQueryParams(req);

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
      : [desc(userTable.created_at)];
  const searchFilter = search
    ? or(ilike(userTable.first_name, `%${search}%`), ilike(userTable.last_name, `%${search}%`))
    : undefined;

  const [queryResult, error] = await withCatch(
    Promise.all([
      database
        .select()
        .from(userTable)
        .where(searchFilter)
        .orderBy(...orderByClauses)
        .limit(limit)
        .offset(offset),
      database.select({ count: count() }).from(userTable).where(searchFilter),
      ,
    ]),
  );

  if (error) {
    console.log(`Failed to get user: ${error.message}`);
    return NextResponse.json({ message: error.message }, { status: STATUS_CODE.BAD_REQUEST });
  }

  const [data, countResult] = queryResult;
  const totalItems = countResult[0]?.count || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const result: ResponseData<Users[]> = {
    metadata: {
      limit: limit > 0 ? limit : 10,
      page,
      pageSize: data.length,
      totalPages: totalPages,
    },
    data: data ? data : [],
  };

  return NextResponse.json(result, { status: STATUS_CODE.OK });
});
