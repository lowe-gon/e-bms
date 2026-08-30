import type { Database } from '@/typings/database.types';

export type UserRole = 'captain' | 'secretary' | 'treasurer' | 'councilor';

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

export type Users = Database['public']['Tables']['users']['Row'];
export type Sectors = Database['public']['Tables']['sectors']['Row'];
export type Puroks = Database['public']['Tables']['puroks']['Row'];

export type UserWithSectorAndPurok = Users & {
  sector: Sectors & {
    puroks: Puroks[];
  };
};
