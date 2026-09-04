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

// process.env always stores values as strings.
const port = Number(PORT);
if (!Number.isInteger(port) || port <= 0) {
  throw new Error("PORT must be a valid positive integer");
}

export const env = {
  port,
  nodeEnv: NODE_ENV,
  clientUrl: CLIENT_URL,
} as const;
