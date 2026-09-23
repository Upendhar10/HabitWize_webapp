// RTK Query's central infrastructure

import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '@/app/api/basequery.ts';

export const api = createApi({
  reducerPath: 'api',

  baseQuery,

  tagTypes: [],

  endpoints: () => ({}),
});
