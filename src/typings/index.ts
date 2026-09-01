import type { sectorTable, userTable } from '@/database/schema';

export type TUsers = typeof userTable.$inferSelect;
export type TSectors = typeof sectorTable.$inferSelect;
