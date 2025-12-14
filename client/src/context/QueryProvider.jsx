/**
 * React Query Provider Wrapper
 *
 * This file sets up TanStack Query (formerly React Query) for intelligent client-side caching.
 * Wrap your App component with this provider to enable:
 * - Automatic caching of API responses
 * - Smart stale/fresh data management
 * - Background refetching
 * - Request deduplication
 *
 * Usage in App.jsx:
 *   import QueryProvider from './context/QueryProvider';
 *
 *   function Root() {
 *     return (
 *       <QueryProvider>
 *         <App />
 *       </QueryProvider>
 *     );
 *   }
 */

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client for managing queries
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 10 minutes by default
      // (Can be overridden per-query with staleTime option)
      staleTime: 1000 * 60 * 10,

      // Retry failed requests once
      retry: 1,

      // Show cached data while refetching in background
      refetchOnWindowFocus: true,
    },
  },
});

export default function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
