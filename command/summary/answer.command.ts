import { Command } from "../command.ts";
import { saveAnswer } from "../../storage/mod.ts";
import { DiscordenoMessage, DiscordenoGuild, Embed } from "../../deps.ts";
import { validateSchema } from "../../util/mod.ts";
import config from "../../config.js";

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
  image: {
    $optional: true,
    $type: {
      url: "string"
    }
  },
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
      type: "...str"
    }
  ],
  execute: async (message: DiscordenoMessage, name: string, response: string) => {
    if (!config.developers.includes(message.authorId.toString())) {
      throw { title: "No permission!", description: "Only bot developers can use this command" };
    }
    try {
      let responseJson = JSON.parse(
        response
          .replace("$COLOR", config.color + "")
          .replace("$GUILD_ICON", message.guild?.iconURL(64, "png")  || "")
      );
      if (!validateSchema(embedSchema, responseJson)) {
        throw {
          title: "Invalid JSON!",
          description: "The given response doesn't match with the embed schema"
        };
      } else if (!(await saveAnswer(message.guild as DiscordenoGuild, name, responseJson as Embed, true, true))) {
        throw {
          title: "Cannot register custom answer",
          description: "A command or embed answer is already registered with the name " + name
        };
      }
      message.channel?.send({ content: `:white_check_mark: Registered \`${name}\`...`, embed: responseJson });
    } catch (err) {
      // already custom error
      if (err.title) {
        throw err;
      } else {
        throw { 
          title: "Invalid JSON!",
          description: "The embed must be represented using JSON, error: " + err.message
        };
      }
    }
  }

};

export default command;