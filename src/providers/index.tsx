import { Toaster } from '@/components/ui/sonner';
import ClerkProvider from '@/providers/clerk-provider';
import QueryClientProvider from '@/providers/query-client-provider';
import React from 'react';

export default function AppProvider({ children }: React.PropsWithChildren) {
  return (
    <>
      <QueryClientProvider>
        <ClerkProvider>
          {children} <Toaster position="top-right" />
        </ClerkProvider>
      </QueryClientProvider>
    </>
  );
}
