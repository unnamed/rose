import * as log from "https://deno.land/std/log/mod.ts";

// logger initialization
await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("INFO", {
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
      level: "INFO",
      handlers: ["console"]
    }
  }
});
export const logger: log.Logger = log.getLogger();

export * from "https://deno.land/x/discordeno/mod.ts"
