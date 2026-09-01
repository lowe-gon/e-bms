import type { sectorTable, userTable } from '@/database/schema';

export type UserRole = 'captain' | 'secretary' | 'treasurer' | 'councilor' | 'staff' | 'tanod';

export type ResponseMetadata = {
  limit: number;
  page: number;
  pageSize?: number;
  totalPages?: number;
  searchQuery?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type ResponseData<TData> = {
  success: boolean;
  metadata: ResponseMetadata | null;
  data: TData;
  message: string;
};

export type Users = typeof userTable.$inferSelect;
export type Sectors = typeof sectorTable.$inferSelect;

export type UsersWithSectors = Users & {
  sectors: Sectors | null;
};
