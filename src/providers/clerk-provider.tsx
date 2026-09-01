import { ENV } from '@/typings/env';
import { ClerkProvider as ClerkProviderBase } from '@clerk/nextjs';
import React from 'react';

const CLERK_PUBLISHABLE_KEY = ENV.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    'Clerk publishable key is missing. Please ensure NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set in your environment variables.',
  );
}

export default function ClerkProvider({ children }: React.PropsWithChildren) {
  return (
    <ClerkProviderBase publishableKey={CLERK_PUBLISHABLE_KEY} dynamic>
      {children}
    </ClerkProviderBase>
  );
}
