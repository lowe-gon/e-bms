import { STATUS_CODE } from '@/constants/http-status-code';
import database from '@/database';
import { sectorTable, userTable } from '@/database/schema';
import { withAuth } from '@/helpers/with-auth';
import { withCatch } from '@/lib/try-catch';
import type { ResponseData, UsersWithSectors } from '@/typings';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const GET = withAuth(
  async (): Promise<NextResponse<ResponseData<UsersWithSectors[] | null>>> => {
    try {
      const [sectorData, sectorError] = await withCatch(
        database
          .select()
          .from(userTable)
          .innerJoin(sectorTable, eq(userTable.id, sectorTable.assignedCouncilorId)),
      );

      if (sectorError) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            message: `Failed to get sectors data: ${sectorError.message}`,
            metadata: null,
          },
          { status: STATUS_CODE.BAD_REQUEST },
        );
      }

      const formattedData: UsersWithSectors[] = sectorData.map((row) => ({
        ...row.users,
        sectors: row.sectors,
      }));

      return NextResponse.json(
        {
          success: true,
          data: formattedData,
          message: 'Successfully get sectors data',
          metadata: null,
        },
        { status: STATUS_CODE.OK },
      );
    } catch (error) {
      return NextResponse.json(
        {
          success: true,
          data: null,
          message: error instanceof Error ? error.message : 'An unknown error occured!',
          metadata: null,
        },
        { status: STATUS_CODE.SERVER_ERROR },
      );
    }
  },
);
