import { Command } from "../command.ts";
import { Message, Member } from "../../deps.ts";

const command: Command = {
  name: "avatar",
  category: "utility",
  aliases: ["profilepic"],
  description: "Look for someone's avatar",
  arguments: [
    { type: "message" },
    { 
      type: "member",
      name: "member",
      optional: true
    }
  ],
  execute: async (message: Message, member?: Member) => {
    if (!member) {
      member = message.member;
    }
    message.channel?.send({ embed: { title: "poto", image: { url: member?.avatarURL } }})
  }
};

export default command;