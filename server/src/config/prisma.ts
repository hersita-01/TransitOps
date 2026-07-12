import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient | null = null;

// Export a proxy that instantiates PrismaClient lazily when a property is accessed.
// This prevents startup crashes when the Database Engineer's schema is not yet generated.
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    if (prop === 'isInitialized') {
      return prismaInstance !== null;
    }
    
    if (!prismaInstance) {
      prismaInstance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
    return Reflect.get(prismaInstance, prop, receiver);
  },
});
