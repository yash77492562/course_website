'use client';

/**
 * QueryProvider — app-wide React Query client.
 *
 * Previously every data fetch was a hand-rolled `useEffect` + `useState`
 * (loading/error/data) with bespoke localStorage caching. React Query gives us
 * caching, request dedup, background refetch, and cache invalidation for free.
 *
 * The client is created inside component state so it is stable across renders
 * but never shared between users on the server (one client per browser tab).
 */

import { useState, type ReactNode } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 5 min — matches the old manual TTL
            // in useCourseAccess, but now applied uniformly and invalidatable.
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
