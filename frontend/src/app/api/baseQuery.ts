import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { env } from '@/config/env.config.ts';

// fetchBaseQuery is Redux Toolkit's lightweight wrapper around fetch
export const baseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,

  credentials: 'include',
});
