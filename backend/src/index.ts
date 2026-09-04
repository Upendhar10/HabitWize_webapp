import "dotenv/config";
import { env } from "@/config/env.config.js";

import app from "@/app";

const PORT = env.port;

// Define a route for the root URL
app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
