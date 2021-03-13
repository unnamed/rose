import { startBot, logger, editBotsStatus, ActivityType } from "./deps.ts";

import loadListeners from "./loader/listener.loader.ts";
import loadCommands from "./loader/command.loader.ts";

let eventHandlers = await loadListeners();
eventHandlers.ready = () => {
  logger.info("Successfully connected");
  editBotsStatus("online", "@Unnamed Bot", ActivityType.Listening);
};

loadCommands();

startBot({
  token: Deno.env.get("BOT_TOKEN") as string,
  intents: ["GUILDS", "GUILD_MESSAGES"],
  eventHandlers
});
