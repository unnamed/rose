/**
 * Type for logging levels, contains internal
 * information like priority and 'external'
 * information like name
 */
export interface Level {
  name: string;
  priority: number;
}

/**
 * Object holding default logging
 * levels
 */
export const Levels: { [name: string]: Level } = {
  DEBUG: {
    name: 'DEBUG',
    priority: 0
  },
  FINE: {
    name: 'FINE',
    priority: 10
  },
  INFO: {
    name: 'INFO',
    priority: 20
  },
  WARN: {
    name: 'WARN',
    priority: 30
  },
  ERROR: {
    name: 'ERROR',
    priority: 40
  },
  SEVERE: {
    name: 'SEVERE',
    priority: 50
  }
};

/**
 * Type for logged messages handler, it can be
 * a 'FileHandler' that logs messages to a file,
 * or a 'StdHandler' that logs messages to the
 * console
 */
export type Handler = (
  level: Level,
  message: string
) => Promise<void>;

/**
 * Logged messages handler that writes the
 * received messages to std-in or std-out,
 * depending on level
 */
export const stdHandler: Handler = async (
  level: Level,
  message: string
): Promise<void> => {
  const now: Date = new Date();
  const log = `[${now.toLocaleString()} ${level.name}]: ${message}`;
  if (level.priority <= Levels.SEVERE.priority
    && level.priority >= Levels.ERROR.priority) {
    console.error(log);
  } else {
    console.log(log);
  }
};

/**
 * Most important class of the logging
 * module, contains methods for logging
 * and formatting messages
 */
export class Logger {

  // Array of handlers for this logger
  handlers: Handler[] = [];
  // Minimum level for logging
  minimumLevel: number;

  //#region logging functions
  fine(message, ...params): void {
    this.doLog(Levels.FINE, message, params);
  }

  info(message, ...params): void {
    this.doLog(Levels.INFO, message, params);
  }

  warn(message, ...params): void {
    this.doLog(Levels.WARN, message, params);
  }

  error(message, ...params): void {
    this.doLog(Levels.ERROR, message, params);
  }

  severe(template, ...params): void {
    this.doLog(Levels.SEVERE, template, params);
  }

  debug(template, ...params): void {
    this.doLog(Levels.DEBUG, template, params);
  }

  private doLog(level: Level, template, ...params) {
    if (level.priority >= this.minimumLevel) {
      const message = (template as string) + params.join(' ');
      this.handlers.forEach(handle => handle(level, message));
    }
  }

  //#endregion

}