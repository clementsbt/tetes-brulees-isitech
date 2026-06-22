// Database singleton - wrapper around Prisma
import { prisma } from './prisma';

export const db = {
  user: {
    findUnique: async (opts: any) => (await prisma()).user.findUnique(opts),
    findMany: async (opts: any) => (await prisma()).user.findMany(opts),
    update: async (opts: any) => (await prisma()).user.update(opts),
    create: async (opts: any) => (await prisma()).user.create(opts),
  },
  event: {
    findUnique: async (opts: any) => (await prisma()).event.findUnique(opts),
    findMany: async (opts: any) => (await prisma()).event.findMany(opts),
    create: async (opts: any) => (await prisma()).event.create(opts),
    delete: async (opts: any) => (await prisma()).event.delete(opts),
  },
  participation: {
    findUnique: async (opts: any) => (await prisma()).participation.findUnique(opts),
    create: async (opts: any) => (await prisma()).participation.create(opts),
    deleteMany: async (opts: any) => (await prisma()).participation.deleteMany(opts),
  },
};