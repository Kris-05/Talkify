import dotenv from "dotenv";
dotenv.config();

import { createClient } from "redis";

const URL = process.env.REDIS_URL;

if (!URL) {
  throw new Error("REDIS_URL is not defined in environment variables");
}

export const redisClient = createClient({ url: URL });
