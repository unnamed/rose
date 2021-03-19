import { startBot, logger, editBotsStatus, ActivityType } from "./deps.ts";

import loadListeners from "./loader/listener.loader.ts";
import loadCommands from "./loader/command.loader.ts";

import { register } from "./command/slash/slash.command.ts";

let eventHandlers = await loadListeners();

eventHandlers.ready = () => {

  register(
    {
      guildID: "683899335405994062",
      name: "hello",
      description: "Make the bot say hello!",
    },
    async interaction => {
      interaction.sendResponse({
        private: true,
        type: 5,
        data: {
          content: "Hello!"
        }
      });
    }
  )

  logger.info("Successfully connected");
  editBotsStatus("online", "@Unnamed Bot", ActivityType.Listening);
};

loadCommands();

startBot({
  token: Deno.env.get("BOT_TOKEN") as string,
  intents: ["GUILDS", "GUILD_MESSAGES"],
  eventHandlers
});
