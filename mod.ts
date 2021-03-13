import { startBot, logger } from "./deps.ts";

import onMessage from "./moderation/message.listener.ts";

startBot({
  token: Deno.env.get('BOT_TOKEN') as string,
  intents: ["GUILDS", "GUILD_MESSAGES"],
  eventHandlers: {
    ready: () => logger.info("Successfully connected"),
    messageCreate: onMessage
  }
});
