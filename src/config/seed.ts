import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { sequelize, User } from '../models';
import { logger } from '../utils/logger.util';

dotenv.config();

async function seed() {
  try {
    logger.info('Connecting to database...');
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');

    const existingAdmin = await User.findOne({
      where: { username: adminUsername },
    });

    if (existingAdmin) {
      logger.info('Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);
    await User.create({
      username: adminUsername,
      passwordHash,
      role: 'admin',
      isActive: true,
    });

    logger.info('Admin user created successfully with admin role!');

    process.exit(0);
  } catch (error) {
    logger.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
