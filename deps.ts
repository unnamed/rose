import * as log from "https://deno.land/std/log/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

const minLevelForConsole: log.LevelName = Deno.env.get("ENVIRONMENT")?.toLowerCase() === "dev" ? "DEBUG" : "INFO";

// logger initialization
await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler(minLevelForConsole, {
      formatter: record => {
        let now = new Date();
        let date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        let message = `[${record.levelName}] [${date}] ${record.msg}`;
        record.args.forEach((arg, index) => message += `, arg${index}: ${arg}`);
        return message;
      }
    })
  },
  loggers: {
    default: {
      level: minLevelForConsole,
      handlers: ["console"]
    }
  }
});
export const logger: log.Logger = log.getLogger();

export * from "https://deno.land/x/discordeno/mod.ts"
