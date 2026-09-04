import { ROLES } from '@/constants/user-role';
import database from '@/database';
import { sectorTable } from '@/database/schema';
import { ZSectorFormSchema } from '@/features/sectors/schemas/sector-form.schema';
import { parseRequestJsonSchema, parseRequestQueryParams } from '@/lib/parse-api-request';
import { badRequest, created, ok, serverError } from '@/lib/response';
import { tryCatch } from '@/lib/try-catch';
import { withRole } from '@/lib/with-role';
import type { TSectors } from '@/typings';
import type { ApiResponse } from '@/typings/api.types';
import { eq, sql } from 'drizzle-orm';
import type { NextResponse } from 'next/server';

export const POST = withRole(
  [ROLES.CAPTAIN, ROLES.SECRETARY],
  async (request): Promise<NextResponse<ApiResponse<TSectors[] | null>>> => {
    try {
      const parseSchema = await parseRequestJsonSchema(request, ZSectorFormSchema);

      if (!parseSchema.success) {
        return parseSchema.response;
      }

      const { assignedCouncilorId, name, purokCoverage } = parseSchema.data;

      const [sectors, sectorsError] = await tryCatch(
        database.insert(sectorTable).values({
          code: sql`'SEC-' || nextval('sector_code_seq')`,
          assignedCouncilorId,
          purokCoverage: purokCoverage.split(','),
          name: name ?? '',
        }),
      );

      if (sectorsError) {
        return badRequest(`Failed to insert sector`);
      }

      return created<TSectors[]>(sectors, 'Successfully created sector');
    } catch (error) {
      return serverError(error instanceof Error ? error.message : 'An unknown error occured');
    }
  },
);

export const PUT = withRole(
  [ROLES.CAPTAIN, ROLES.SECRETARY],
  async (request): Promise<NextResponse<ApiResponse<TSectors[] | null>>> => {
    const { raw } = parseRequestQueryParams(request);
    const sectorId = raw.get('sectorId') as string;
    try {
      const parseSchema = await parseRequestJsonSchema(request, ZSectorFormSchema);

      if (!parseSchema.success) {
        return parseSchema.response;
      }

      const { assignedCouncilorId, name, purokCoverage } = parseSchema.data;

      const [sectors, sectorsError] = await tryCatch(
        database
          .update(sectorTable)
          .set({
            assignedCouncilorId,
            purokCoverage: purokCoverage.split(','),
            name: name ?? '',
          })
          .where(eq(sectorTable.id, sectorId)),
      );

      if (sectorsError) {
        return badRequest(`Failed to update sector`);
      }

      return ok<TSectors[]>(sectors, 'Successfully update sector');
    } catch (error) {
      return serverError(error instanceof Error ? error.message : 'An unknown error occured');
    }
  },
);

export const DELETE = withRole(
  [ROLES.CAPTAIN, ROLES.SECRETARY],
  async (request): Promise<NextResponse<ApiResponse<TSectors[] | null>>> => {
    const { raw } = parseRequestQueryParams(request);
    const sectorId = raw.get('sectorId') as string;
    try {
      const [sectors, sectorsError] = await tryCatch(
        database.delete(sectorTable).where(eq(sectorTable.id, sectorId)),
      );

      if (sectorsError) {
        return badRequest(`Failed to update sector`);
      }

      return ok<TSectors[]>(sectors, 'Successfully update sector');
    } catch (error) {
      return serverError(error instanceof Error ? error.message : 'An unknown error occured');
    }
  },
);
