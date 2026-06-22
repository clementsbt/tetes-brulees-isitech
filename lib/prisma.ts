// Prisma client singleton
 
let prismaClient: any;

export async function prisma() {
  if (!prismaClient) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('@prisma/client');
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}