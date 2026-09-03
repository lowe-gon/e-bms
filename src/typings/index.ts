import type { sectorTable, userTable } from '@/database/schema';
import React from 'react';

export type TOption = {
  label: string;
  value: string;
  count?: number;
  icon?: React.ComponentType<React.ComponentProps<'svg'>>;
};

export type TUsers = typeof userTable.$inferSelect;
export type TSectors = typeof sectorTable.$inferSelect;

export type TUserWithSector = TUsers & {
  sectors: TSectors | null;
};
