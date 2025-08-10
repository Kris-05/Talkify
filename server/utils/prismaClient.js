import { PrismaClient } from '@prisma/client';

let prismaInstance = null;

export const getPrismaClient = () => {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}