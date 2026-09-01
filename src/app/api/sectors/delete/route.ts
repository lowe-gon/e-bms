import database from '@/database';
import { sectorTable } from '@/database/schema';
import { withAuth } from '@/helpers/with-auth';
import { parseQueryParams } from '@/lib/parse-query';
import { withCatch } from '@/lib/try-catch';
import type { ResponseData, Sectors } from '@/typings';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const DELETE = withAuth(
  async (req): Promise<NextResponse<ResponseData<Sectors[] | null>>> => {
    const { raw } = parseQueryParams(req);
    const sectorId = raw.get('sectorId') as string;

    try {
      const [sectorData, sectorError] = await withCatch<Sectors[]>(
        database.delete(sectorTable).where(eq(sectorTable.id, sectorId)),
      );

      if (sectorError) {
        return NextResponse.json({
          success: false,
          message: `Failed to delete sector: ${sectorError.message}`,
          data: null,
          metadata: null,
        });
      }

      return NextResponse.json({
        success: false,
        message: 'Successfully deleted sector',
        data: sectorData,
        metadata: null,
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occured',
        data: null,
        metadata: null,
      });
    }
  },
);
