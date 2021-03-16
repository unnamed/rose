import { Command } from "../command.ts";
import { registerEmbedResponse } from "../command.manager.ts";
import { Message } from "../../deps.ts";
import { validateSchema } from "../../util/mod.ts";
import config from "../../config.ts";

/**
  provider?: EmbedProvider;
  author?: EmbedAuthor;
  fields?: EmbedField[];
 */

const embedSchema = {
  title: { $optional: true, $type: "string" },
  description: { $optional: true, $type: "string" },
  color: { $optional: true, $type: "number" },
  url: { $optional: true, $type: "string" },
  timestamp: { $optional: true, $type: "string" },
  footer: {
    $optional: true,
    $type: {
      text: "string",
      icon_url: { $optional: true, $type: "string" }
    }
  },
  author: {
    $optional: true,
    $type: {
      name: "string",
      url: { $optional: true, $type: "string" },
      icon_url: { $optional: true, $type: "string" }
    }
  }
};

const command: Command = {
  name: "answer",
  category: "utility",
  description: "Add a custom embed response for a custom command",
  permissions: {
    use: ["ADMINISTRATOR"]
  },
  arguments: [
    { type: "message" },
    {
      name: "name",
      type: "str"
    },
    {
      name: "response",
      type: "str",
      infinite: true
    }
  ],
  execute: (message: Message, name: string, response: string) => {
    if (!config.developers.includes(message.author.id)) {
      throw { heading: "No permission!", description: "Only bot developers can use this command" };
    }
    try {
      let responseJson = JSON.parse(
        response
          .replace("$COLOR", config.color + "")
          .replace("$GUILD_ICON", message.guild?.iconURL(64, "png")  || "")
      );
      if (!validateSchema(embedSchema, responseJson)) {
        throw {
          heading: "Invalid JSON!",
          description: "The given response doesn't match with the embed schema"
        };
      } else if (!registerEmbedResponse(name, responseJson)) {
        throw {
          heading: "Cannot register custom answer",
          description: "A command or embed answer is already registered with the name " + name
        };
      }
      message.channel?.send({ content: `:white_check_mark: Registered \`${name}\`...`, embed: responseJson });
    } catch (err) {
      // already custom error
      if (err.heading) {
        throw err;
      } else {
        throw { 
          heading: "Invalid JSON!",
          description: "The embed must be represented using JSON, error: " + err.message
        };
      }
    }
  }

};

export default command;