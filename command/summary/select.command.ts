import { Command } from "../command.ts";

const command: Command = {
  name: "select",
  description: "Let the bot make your decisions",
  category: "fun",
  arguments: [
    {
      type: "...str",
      name: "decisions (separated by '|')"
    }
  ],
  execute: async (decisions: string) => {
    let decisionsArray = decisions.split("|");
    let selection = decisionsArray[Math.floor(Math.random() * decisionsArray.length)].trim();
    throw {
      title: "Hmmm...",
      description: selection
    };
  }
}

export default command;