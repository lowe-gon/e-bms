import { Toaster } from '@/components/ui/sonner';
import ClerkProvider from '@/providers/clerk-provider';
import React from 'react';

export default function AppProvider({ children }: React.PropsWithChildren) {
  return (
    <>
      <ClerkProvider>
        {children} <Toaster position="top-right" />
      </ClerkProvider>
    </>
  );
}
