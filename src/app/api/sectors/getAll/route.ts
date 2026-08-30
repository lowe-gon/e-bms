import { STATUS_CODE } from '@/constants/http-status-code';
import database from '@/database';
import { withAuth } from '@/helpers/with-auth';
import { withCatch } from '@/lib/try-catch';
import { NextResponse } from 'next/server';

export const GET = withAuth(async () => {
  try {
    const [sectorData, sectorError] = await withCatch(
      database.query.userTable.findMany({
        where: {
          sector_id: {
            isNotNull: true,
          },
        },
        with: {
          sector: {
            with: {
              puroks: true,
            },
          },
        },
      }),
    );

    if (sectorError) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: `Failed to get sectors data: ${sectorError.message}`,
        },
        { status: STATUS_CODE.BAD_REQUEST },
      );
    }

    const sortedData = sectorData.sort((a, b) => {
      const dateA = a.sector?.created_at ? new Date(a.sector.created_at).getTime() : 0;
      const dateB = b.sector?.created_at ? new Date(b.sector.created_at).getTime() : 0;
      return dateA - dateB; // Change to `dateA - dateB` for ascending order
    });

    return NextResponse.json(
      { success: true, data: sortedData, message: 'Successfully get sectors data' },
      { status: STATUS_CODE.OK },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: true,
        data: null,
        message: error instanceof Error ? error.message : 'An unknown error occured!',
      },
      { status: STATUS_CODE.SERVER_ERROR },
    );
  }
});
