import { STATUS_CODE } from '@/constants/http-status-code';
import database from '@/database';
import { sectorTable } from '@/database/schema';

import { SectorFormSchema } from '@/features/sectors/schema/sector-form.schema';
import { withAuth } from '@/helpers/with-auth';
import { parseRequest } from '@/lib/parse-request';
import { withCatch } from '@/lib/try-catch';
import type { ResponseData, Sectors } from '@/typings';
import { count } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const POST = withAuth(async (req): Promise<NextResponse<ResponseData<Sectors[] | null>>> => {
  const parsed = await parseRequest(req, SectorFormSchema);

  if (!parsed.success) {
    return parsed.response;
  }

  const { assignedOfficial, purok, sectorName } = parsed.data;

  try {
    const [sectorCount, sectorCountError] = await withCatch(
      database.select({ count: count() }).from(sectorTable),
    );

    if (sectorCountError) {
      throw new Error(`Failed to retrieve sector count: ${sectorCountError.message}`);
    }

    const nextIndex = sectorCount[0]?.count ?? 0;
    const sectorCode = `SEC-${nextIndex}`;

    const [sectors, sectorError] = await withCatch(
      database.insert(sectorTable).values({
        assignedCouncilorId: assignedOfficial,
        code: sectorCode,
        purokCoverage: purok,
        name: sectorName,
      }),
    );

    if (sectorError) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to create new sector: ${sectorError.message}`,
          data: null,
          metadata: null,
        },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    return NextResponse.json(
      { success: true, message: 'Successfully created sector', data: sectors, metadata: null },
      { status: STATUS_CODE.OK },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occured',
        data: null,
        metadata: null,
      },
      { status: STATUS_CODE.BAD_REQUEST },
    );
  }
});
