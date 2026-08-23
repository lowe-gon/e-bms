'use client';

import { getQueryClient } from '@/lib/query-client';
import { QueryClientProvider as QueryClientProviderBase } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

export default function QueryClientProvider({ children }: React.PropsWithChildren) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProviderBase client={queryClient}>
      {children} <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProviderBase>
  );
}
