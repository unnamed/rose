import { Levels, Logger, stdHandler } from './logger';

// configure the default logger
const logger = new Logger();

logger.handlers.push(stdHandler);

if (process.env.ENVIRONMENT == 'DEV') {
  logger.minimumLevel = Levels.DEBUG.priority;
} else {
  logger.minimumLevel = Levels.INFO.priority;
}

export default logger;
