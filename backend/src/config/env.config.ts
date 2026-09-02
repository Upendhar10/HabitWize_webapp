const { PORT, NODE_ENV, CLIENT_URL } = process.env;

if (!PORT) {
  throw new Error("Missing required environment variable: PORT");
}

if (!NODE_ENV) {
  throw new Error("Missing required environment variable: NODE_ENV");
}

if (!CLIENT_URL) {
  throw new Error("Missing required environment variable: CLIENT_URL");
}

export const env = {
  port: Number(PORT), // process.env always stores values as strings.
  nodeEnv: NODE_ENV,
  clientUrl: CLIENT_URL,
} as const;

