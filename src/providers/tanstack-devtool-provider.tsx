'use client';

import { TanStackDevtools } from '@tanstack/react-devtools';
import { tableDevtoolsPlugin } from '@tanstack/react-table-devtools';
import React from 'react';

export default function TanStackDevtoolProvider({ children }: React.PropsWithChildren) {
  return (
    <>
      {children}

      <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
    </>
  );
}
