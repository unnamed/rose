import { Command } from "../command.ts";
import { DiscordenoMessage, DiscordenoMember } from "../../deps.ts";
import config from "../../config.js";

const command: Command = {
  name: "avatar",
  category: "utility",
  aliases: ["profilepic", "av"],
  description: "Look for someone's avatar",
  arguments: [
    { type: "message" },
    { 
      type: "member",
      name: "member",
      defaultValue: null
    }
  ],
  execute: async (message: DiscordenoMessage, member?: DiscordenoMember) => {
    if (!member) {
      member = message.member;
    }
    throw {
      title: `Here's is the ${member?.username}'s avatar`,
        description: "Please don't weird things with this!",
        color: config.color,
        image: {
          url: member?.makeAvatarURL({
            size: 512,
            format: 'png'
          })
        },
        footer: {
          text: `Requested by ${message.member?.username}`,
          icon_url: message.member?.avatarURL
        }
    };
  }
};

export default command;