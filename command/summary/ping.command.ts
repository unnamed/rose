import { Command } from "../command.ts";
import { Message } from "../../deps.ts";

const command: Command = {
  name: "ping",
  description: "Check the bot connection",
  category: "misc",
  arguments: [{ type: "message" }],
  execute: async (message: Message) => {
    let ping = (Date.now() - message.timestamp) / 1000;
    throw {
      heading: "Pong!",
      description: `The bot ping is \`${ping}\` seconds`
    };
  }
}

export default command;