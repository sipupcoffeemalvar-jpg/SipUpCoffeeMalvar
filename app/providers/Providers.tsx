'use client';

import React from 'react';
import { QueryProvider } from './QueryProviders';
import { FeedbackProvider } from '../src/context/FeedBackContext'; 

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <FeedbackProvider>
        {children}
      </FeedbackProvider>
    </QueryProvider>
  );
}