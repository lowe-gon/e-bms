export type UserRole = 'captain' | 'secretary' | 'treasurer' | 'councilor';

export type ResponseMetaData = {
  limit: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ResponseData<TData> = {
  metadata: ResponseMetaData | null;
  data: TData;
};
