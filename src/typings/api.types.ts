export type ResponseMetadata = {
  page: number;
  limit: number;
  pageSize?: number;
  totalPages?: number;
  searchQuery?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type ApiResponse<TData> = {
  success: boolean;
  message: string;
  code: string;
  data: TData | null;
  metadata: ResponseMetadata | null;
};
