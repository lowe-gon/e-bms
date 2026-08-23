import * as schema from '@/database/schema';
import { defineRelations, defineRelationsPart } from 'drizzle-orm';

export const relations = defineRelations(schema, (r) => ({
  userTable: {
    sector: r.one.sectorTable({
      from: r.userTable.sector_id,
      to: r.sectorTable.id,
    }),
  },
}));

export const sectorRelation = defineRelationsPart(schema, (r) => ({
  sectorTable: {
    users: r.many.userTable({
      from: r.sectorTable.id,
      to: r.userTable.sector_id,
    }),
  },
}));
