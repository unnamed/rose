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

// standard filesystem library
export * from "https://deno.land/std@0.67.0/fs/mod.ts";
// discord api wrapper library
export * from "https://deno.land/x/discordeno@11.2.0/mod.ts";
// image manipulation library
export * as ImageScript from 'https://deno.land/x/imagescript@1.2.0/mod.ts';