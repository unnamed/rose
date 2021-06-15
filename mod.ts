import { startBot, logger, editBotStatus, DiscordActivityTypes } from "./deps.ts";

import loadListeners from "./loader/listener.loader.ts";
import loadCommands from "./loader/command.loader.ts";

let eventHandlers = await loadListeners();

eventHandlers.ready = () => {
  logger.info("Successfully connected");
  editBotStatus({
    status: "online",
    activities: [
      {
        name: "@Unnamed Bot",
        type: DiscordActivityTypes.Listening,
        createdAt: Date.now()
      }
    ]
  });
};

loadCommands();

startBot({
  token: Deno.env.get("BOT_TOKEN") as string,
  intents: ["Guilds", "GuildMessages"],
  eventHandlers
});
