const apiBaseUrl = import.meta.env.BASE_URL;

if (!apiBaseUrl) {
  throw new Error('Missing required environment variable : VITE_BASE_URL');
}

export const env = {
  apiBaseUrl,
} as const;
