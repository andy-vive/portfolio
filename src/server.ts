import app from './app';
import { sequelize } from './models';
import { logger } from './utils/logger.util';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    logger.info('Testing database connection...');
    await sequelize.authenticate();
    logger.info('✓ Database connection established successfully');

    app.listen(PORT, () => {
      logger.info(`✓ Server is running on http://localhost:${PORT}`);
      logger.info(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  logger.info('\nSIGTERM received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('\nSIGINT received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

startServer();
