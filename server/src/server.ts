import app from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

const server = app.listen(env.PORT, () => {
  console.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

const gracefulShutdown = async (signal: string) => {
  console.info(`\n👋 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.info('📡 HTTP server closed.');
    try {
      if ((prisma as any).isInitialized) {
        await prisma.$disconnect();
        console.info('💾 Prisma Client disconnected.');
      } else {
        console.info('💾 Prisma Client was not initialized, skipped disconnect.');
      }
      process.exit(0);
    } catch (error) {
      console.error('❌ Error disconnecting Prisma Client during shutdown:', error);
      process.exit(1);
    }
  });

  // Safe timeout for shutdown process
  setTimeout(() => {
    console.error('⏳ Forcefully shutting down because graceful shutdown timed out.');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
