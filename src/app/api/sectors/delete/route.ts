import { STATUS_CODE } from '@/constants/http-status-code';
import database from '@/database';
import { purokTable, sectorTable, sectorToPurokTable } from '@/database/schema';
import { withAuth } from '@/helpers/with-auth';
import { parseQueryParams } from '@/lib/parse-query';
import { withCatch } from '@/lib/try-catch';
import type { ResponseData } from '@/typings';
import { count, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const DELETE = withAuth(async (req): Promise<NextResponse<ResponseData<null>>> => {
  const { raw } = parseQueryParams(req);
  const sectorId = raw.get('sectorId') as string;

  try {
    const [, error] = await withCatch(
      database.transaction(async (tx) => {
        // Find all Purok IDs currently connected to this sector
        const connectedPuroks = await tx
          .select({ purokId: sectorToPurokTable.purok_id })
          .from(sectorToPurokTable)
          .where(eq(sectorToPurokTable.sector_id, sectorId));

        const purokIds = connectedPuroks.map((p) => p.purokId);

        // Delete the sector (cascades and removes rows from sector_to_puroks)
        await tx.delete(sectorTable).where(eq(sectorTable.id, sectorId));

        // Check each affected Purok: if it has 0 remaining connections, delete it
        if (purokIds.length > 0) {
          for (const purokId of purokIds) {
            const [usage] = await tx
              .select({ count: count() })
              .from(sectorToPurokTable)
              .where(eq(sectorToPurokTable.purok_id, purokId));

            if (usage && usage.count === 0) {
              await tx.delete(purokTable).where(eq(purokTable.id, purokId));
            }
          }
        }
      }),
    );

    if (error) {
      return NextResponse.json(
        {
          data: null,
          message: error.message,
          metadata: null,
          success: false,
        },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    return NextResponse.json(
      {
        data: null,
        message: 'Successfuly sector by id',
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
