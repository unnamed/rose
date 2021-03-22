import { Command } from "../command.ts";
import { 
  Message,
  getMessages,
  deleteMessages
} from "../../deps.ts";

const command: Command = {
  name: "clear",
  aliases: ["purge"],
  description: "Bulk-delete some annoying messages",
  category: "utility",
  permissions: {
    use: ["MANAGE_MESSAGES"],
    execute: ["MANAGE_MESSAGES"]
  },
  arguments: [
    { type: "message" },
    {
      type: "int",
      name: "amount",
      defaultValue: 1
    },
    {
      type: "...str",
      name: "reason",
      defaultValue: "No reason provided",
    }
  ],
  execute: async (message: Message, amount: number, reason: string) => {

    if (amount >= 100 || amount < 0) {
      throw {
        heading: "Invalid amount!",
        description: `Cannot delete \`${amount}\` message(s), the amount`
          + ` must be minor than 100 and major than zero!`
      };
    }

    let messages = await getMessages(
      message.channelID,
      { limit: amount + 1 }
    );

    if (messages) {
      await deleteMessages(
        message.channelID,
        messages.map(m => m.id),
        reason
      );
    }

    throw {
      heading: `Purged \`${amount}\` message(s)`,
      description: `\`${amount}\` message(s) have been deleted from the channel \`${message.channel?.name}\`
          **Reason:** \`${reason}\``
    };
  }
}

export default command;