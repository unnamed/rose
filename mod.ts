import { startBot } from "https://deno.land/x/discordeno/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

startBot({
  token: Deno.env.get('BOT_TOKEN') as string,
  intents: ["GUILDS", "GUILD_MESSAGES"],
  eventHandlers: {
    ready: () => console.log("Successfully connected"),
    messageCreate: message => {
      if (message.content === "-ping") message.reply("pong");
    }
  }
});
