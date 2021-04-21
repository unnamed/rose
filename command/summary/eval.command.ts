import { Command } from "../command.ts";
import { Message } from "../../deps.ts";
import config from "../../config.js";
import { wrapCode } from "../../util/mod.ts";

const command: Command = {
  name: "eval",
  category: "hidden",
  description: "Run anything",
  aliases: ["run"],
  permissions: {
    execute: ["ADMINISTRATOR"]
  },
  arguments: [
    { type: 'message' },
    {
      name: 'code',
      type: '...str'
    }
  ],
  execute: async (message: Message, code: string) => {

    if (!config.developers.includes(message.author.id)) {
      throw { title: "No permission!", description: "Only bot developers can use this command" };
    }

    let result; 
    try {
      let localResult = eval(code);
      result = (localResult instanceof Promise) ? (await localResult) : result;
    } catch (err) {
      result = err.message;
    }

    throw {
      title: "Evaluation Result",
      fields: [
        {
          name: "Input",
          value: wrapCode("javascript", code)
        },
        {
          name: "Output",
          value: wrapCode("none", result)
        }
      ]
    };
  }
};

export default command;