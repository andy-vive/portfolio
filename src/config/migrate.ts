import { sequelize } from '../models';
import { logger } from '../utils/logger.util';

async function migrate() {
  try {
    logger.info('Connecting to database...');
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    logger.info('Syncing database models...');
    await sequelize.sync({ alter: true });
    logger.info('Database models synced successfully.');

    logger.info('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
