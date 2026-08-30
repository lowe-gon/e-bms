import { STATUS_CODE } from '@/constants/http-status-code';
import database from '@/database';
import { purokTable, sectorTable, sectorToPurokTable, userTable } from '@/database/schema';
import { SectorFormSchema } from '@/features/sectors/schema/sector-form.schema';
import { withAuth } from '@/helpers/with-auth';
import { parseRequest } from '@/lib/parse-request';
import { withCatch } from '@/lib/try-catch';
import { eq, inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const POST = withAuth(async (req) => {
  const parsed = await parseRequest(req, SectorFormSchema);

  if (!parsed.success) {
    return parsed.response;
  }

  const { assignedOfficial, purok, sectorName } = parsed.data;

  const [result, error] = await withCatch(
    database.transaction(async (tx) => {
      // Create the Sector
      const [newSector] = await tx.insert(sectorTable).values({ name: sectorName }).returning();

      if (!newSector) {
        throw new Error('Failed to create sector');
      }

      // Insert or fetch requested Puroks
      if (purok.length > 0) {
        const insertedPuroks = await tx
          .insert(purokTable)
          .values(purok.map((name) => ({ name })))
          .onConflictDoNothing()
          .returning({ id: purokTable.id, name: purokTable.name });

        const insertedNames = new Set(insertedPuroks.map((p) => p.name));
        const missingNames = purok.filter((name) => !insertedNames.has(name));

        let existingPuroks: { id: string }[] = [];
        if (missingNames.length > 0) {
          existingPuroks = await tx
            .select({ id: purokTable.id })
            .from(purokTable)
            .where(inArray(purokTable.name, missingNames));
        }

        const targetPurokIds = [
          ...insertedPuroks.map((p) => p.id),
          ...existingPuroks.map((p) => p.id),
        ];

        // Link ONLY the selected Puroks to this new Sector
        if (targetPurokIds.length > 0) {
          await tx
            .insert(sectorToPurokTable)
            .values(
              targetPurokIds.map((purokId) => ({
                sector_id: newSector.id,
                purok_id: purokId,
              })),
            )
            .onConflictDoNothing();
        }
      }

      // Assign Official
      if (assignedOfficial) {
        await tx
          .update(userTable)
          .set({ sector_id: newSector.id })
          .where(eq(userTable.id, assignedOfficial));
      }

      return newSector;
    }),
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: STATUS_CODE.BAD_REQUEST });
  }

  return NextResponse.json({ data: result }, { status: STATUS_CODE.OK });
});
