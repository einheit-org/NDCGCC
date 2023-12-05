import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

export const queryClient = new QueryClient({
  /**
   * @description
   * Global config for react query. These settings can
   * be overwritter on per query basis inside our hooks
   */
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // Five minutes
      refetchInterval: 1000 * 60 * 5, // Five minutes
      gcTime: 1000 * 60 * 5, // Five minutes
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

/**
 * @description
 * Cache API data in browser's localstorage. This allows to keep data
 * cached across page refreshes, closing and opening the browser
 *
 */
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  buster: '',
});
