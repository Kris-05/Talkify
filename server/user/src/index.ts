import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";

import { redisClient } from "./config/redis.js";
import { connectRMQ } from "./config/rabbitmq.js";

import cors from "cors";

dotenv.config();

connectDB();
connectRMQ();

redisClient
  .connect()
  .then(() => console.log("Connected to redis"))
  .catch(console.error);

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v2", userRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
