import app from './app';
import connectDB from './config/db';
import { env } from './config/env';
import logger from './shared/utils/logger';
import agenda from './config/agenda';
import { defineEscalationJob } from './modules/escalation/escalation.scheduler';

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await agenda.start();
    defineEscalationJob();

    app.listen(env.PORT, () => {
      logger.info(`Sentinel API running on port ${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
    });

  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();