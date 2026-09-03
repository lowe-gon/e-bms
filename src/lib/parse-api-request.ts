import { badRequest, serverError } from '@/lib/response';
import type { ApiResponse } from '@/typings/api.types';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export type ParseRequestResult<TSchema extends z.ZodType> =
  | { success: true; data: z.output<TSchema> }
  | { success: false; response: NextResponse<ApiResponse<null>> };

/**
 * Validates request JSON against a Zod schema.
 * Returns inferred output data or an error NextResponse.
 */
export async function parseRequestJsonSchema<TSchema extends z.ZodType>(
  request: NextRequest,
  schema: TSchema,
): Promise<ParseRequestResult<TSchema>> {
  try {
    const contentType = request.headers.get('content-type') ?? '';
    let payload: unknown;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const entries: Record<string, unknown> = {};

      formData.forEach((value, key) => {
        entries[key] = value;
      });

      payload = entries;
    } else {
      payload = await request.json();
    }

    const result = schema.safeParse(payload);

    if (!result.success) {
      return {
        success: false,
        response: badRequest(result.error.issues.map((issue) => issue.message).join(', ')),
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch {
    return {
      success: false,
      response: serverError('Invalid JSON payload'),
    };
  }
}

export type PaginationParams = {
  limit: number;
  page: number;
  offset: number;
};

export type QueryOptions = {
  defaultLimit?: number;
};

/**
 * Parses common query parameters from a Next.js `NextRequest`.
 *
 * Supports:
 * - Pagination: `limit`, `page`
 * - Search: `search`
 * - Filtering: `status`
 * - Sorting: `sortBy`, `sortOrder`
 *
 * Example:
 * `/api/users?page=2&limit=20&search=john&status=active&sortBy=createdAt&sortOrder=desc`
 *
 * Returns the parsed query parameters grouped into:
 * - `pagination`: Pagination values including the calculated offset.
 * - `filters`: Search and filter values.
 * - `sorting`: Sort field(s) and sort direction.
 * - `raw`: Original `URLSearchParams` for accessing additional parameters.
 *
 * @param req - Next.js request containing the query parameters.
 * @param options - Optional configuration for parsing query parameters.
 */
export function parseRequestQueryParams(req: NextRequest, options: QueryOptions = {}) {
  const searchParams = req.nextUrl.searchParams;

  // Use the provided default limit or fall back to 10 records per page.
  const defaultLimit = options.defaultLimit ?? 10;

  // Pagination
  // Ensure the limit and page are always at least 1.
  const limit = Math.max(1, parseInt(searchParams.get('limit') || String(defaultLimit), 10));

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  // Calculate how many records should be skipped.
  // Example: page=3, limit=10 → offset=20.
  const offset = (page - 1) * limit;

  // Search & Filtering
  // Empty search values are normalized to an empty string.
  const search = searchParams.get('search')?.trim() || '';

  // Helper to split pipe-delimited query parameters
  const rawArray = (searchParam: string): string[] | undefined => {
    const value = searchParams.get(searchParam);
    if (!value) return undefined;

    if (value.includes('|')) {
      return value
        .split('|')
        .map((t: string) => t.trim())
        .filter((t: string) => t.toUpperCase() !== '');
    }

    const trimmed = value.trim();
    return trimmed !== '' ? [trimmed] : undefined;
  };

  // Return undefined when no status filter is provided.
  const status = searchParams.get('status') || undefined;

  // Sorting
  // Defaults to sorting by `createdAt`.
  const rawSortBy = searchParams.get('sortBy') || 'createdAt';

  // Supports multiple sort fields using `|`.
  // Example: `sortBy=createdAt|name` → ['createdAt', 'name'].
  const sortBy = rawSortBy.includes('|') ? rawSortBy.split('|') : rawSortBy;

  // Only `asc` is explicitly accepted.
  // Any other value defaults to `desc`.
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

  return {
    pagination: {
      limit,
      page,
      offset,
    },
    filters: {
      search,
      status,
    },
    sorting: {
      sortBy,
      sortOrder,
    },

    // Preserve the original query parameters in case
    // additional/custom parameters need to be accessed later.
    raw: searchParams,
    rawArray,
  };
}
