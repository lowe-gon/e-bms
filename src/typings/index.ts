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
  metadata: ResponseMetadata | null;
  data: TData;
};

export type Users = Database['public']['Tables']['users']['Row'];
