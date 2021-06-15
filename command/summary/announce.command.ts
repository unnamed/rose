import { Command } from "../command.ts";
import { DiscordenoMessage, DiscordenoGuild } from "../../deps.ts";
import config from "../../config.js";

const command: Command = {
  name: "announce",
  category: "hidden",
  description: "Announce something",
  arguments: [
    { type: "message" },
    { 
      type: "...str",
      name: "title> | <description",
      defaultValue: null
    }
  ],
  execute: async (message: DiscordenoMessage, announcement: string) => {
    if (!config.developers.includes(message.authorId.toString())) {
      throw { title: "No permission", description: "Only bot developers can use this command" };
    }

    let args = announcement.split('|');
    let title = args[0].trim();
    let description = args[1].trim();


    let channel = message?.guild?.channels.get(BigInt("683903931424047124"));
    channel?.send({
      embed: {
        title,
        description,
        color: config.color,
        author: {
          name: message.guild?.name,
          iconUrl: message.guild?.iconURL(64, "png")
        },
        footer: {
          text: "Unnamed Bot"
        },
        timestamp: new Date().toISOString()
      }
    })
  }
};

export default command;