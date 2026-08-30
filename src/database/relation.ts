import * as schema from '@/database/schema';
import { defineRelations } from 'drizzle-orm';

export const relations = defineRelations(schema, (r) => ({
  userTable: {
    sector: r.one.sectorTable({
      from: r.userTable.sector_id,
      to: r.sectorTable.id,
    }),
  },
  sectorTable: {
    users: r.many.userTable({
      from: r.sectorTable.id,
      to: r.userTable.sector_id,
    }),
    puroks: r.many.purokTable({
      from: r.sectorTable.id.through(r.sectorToPurokTable.sector_id),
      to: r.purokTable.id.through(r.sectorToPurokTable.purok_id),
    }),
  },
  purokTable: {
    sectors: r.many.sectorTable({
      from: r.purokTable.id.through(r.sectorToPurokTable.purok_id),
      to: r.sectorTable.id.through(r.sectorToPurokTable.sector_id),
    }),
  },
  sectorToPurokTable: {
    sector: r.one.sectorTable({
      from: r.sectorToPurokTable.sector_id,
      to: r.sectorTable.id,
    }),
    purok: r.one.purokTable({
      from: r.sectorToPurokTable.purok_id,
      to: r.purokTable.id,
    }),
  },
}));
