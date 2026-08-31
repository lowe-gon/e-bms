import { NextRequest } from 'next/server';

export type PaginationParams = {
  limit: number;
  page: number;
  offset: number;
};

export type QueryOptions = {
  defaultLimit?: number;
};

export function parseQueryParams(req: NextRequest, options: QueryOptions = {}) {
  const searchParams = req.nextUrl.searchParams;
  const defaultLimit = options.defaultLimit ?? 10;

  // Pagination
  const limit = Math.max(1, parseInt(searchParams.get('limit') || String(defaultLimit), 10));
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const offset = (page - 1) * limit;

  // Search & Filtering
  const search = searchParams.get('search')?.trim() || '';
  const status = searchParams.get('status') || undefined;

  // Sorting
  const rawSortBy = searchParams.get('sortBy') || 'createdAt';
  const sortBy = rawSortBy.includes('|') ? rawSortBy.split('|') : rawSortBy;
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

  return {
    pagination: { limit, page, offset },
    filters: { search, status },
    sorting: { sortBy, sortOrder },
    raw: searchParams,
  };
}
