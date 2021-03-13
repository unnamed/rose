import { startBot, logger } from "./deps.ts";

import loadListeners from "./loader/listener.loader.ts";

let eventHandlers = await loadListeners();
eventHandlers.ready = () => logger.info("Successfully connected");

startBot({
  token: Deno.env.get('BOT_TOKEN') as string,
  intents: ["GUILDS", "GUILD_MESSAGES"],
  eventHandlers
});
