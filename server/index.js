import express from 'express';
import cors from 'cors';  
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import setupSocket from './socket.js';

// env variables
dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

// middlewares
app.use(cors({
  origin: process.env.ORIGIN, 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

// Prisma will normally connect lazily (only when the first query runs)
// for manuall connection ->
// async function connectDB() {
//   try {
//     await prisma.$connect();
//     console.log("Database connected successfully");
//   } catch (err) {
//     console.error("Database connection failed:", err);
//     process.exit(1); // stop app if DB not connected
//   }
// }

// start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

setupSocket(server)