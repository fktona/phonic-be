import { Server as HttpServer } from 'http';
import app from './app';
import prisma from './client';
import config from './config/config';
import logger from './config/logger';
import { initializeSocket } from './sockets/battle.socket';

let server: HttpServer;

prisma.$connect().then(() => {
  logger.info('Connected to SQL Database');

  server = app.listen(config.port, () => {
    logger.info(`Listening on port ${config.port}`);
  });

  // Initialize Socket.IO
  initializeSocket(server);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

export { server };
