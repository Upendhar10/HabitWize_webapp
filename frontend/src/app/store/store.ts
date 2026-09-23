import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { api } from '@/app/api/api.ts';

export const store = configureStore({
  reducer: {
    // holds the RTK Query cache
    [api.reducerPath]: api.reducer,
  },

  // handles subscriptions, caching behavior
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// enables refetching on reconnect and related lifecycle-driven refetch behaviors.
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
