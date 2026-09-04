import type { householdTable, sectorTable, userTable } from '@/database/schema';
import React from 'react';

export type TOption = {
  label: string;
  value: string;
  count?: number;
  imageUrl?: string;
  icon?: React.ComponentType<React.ComponentProps<'svg'>>;
};

export type TUsers = typeof userTable.$inferSelect;
export type TSectors = typeof sectorTable.$inferSelect;
export type THouseholds = typeof householdTable.$inferSelect;

export type TUserWithSector = TUsers & {
  sectors: TSectors | null;
};

export type TUserWithHouseholds = TUserWithSector & {
  households: THouseholds[] | null;
};
