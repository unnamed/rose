import { Message, DiscordUser, logger } from "../deps.ts";

/**
 * Map containing all the user
 * identifiers that are in cooldown.
 * 
 * When a user sends a message being
 * in this map, the value is incremented.
 */
const warnings = new Map<string, number>();

const subtractDelay = 2_000;

export default function onMessage(message: Message) {
  if (!message.author.bot) {
    let id: string = message.author.id;
    let count: number = warnings.get(id) || 0;
    warnings.set(id, ++count);

    if (count == 5) {
      message.channel?.send("stfu");
    }

    setTimeout(() => {
      let currentCount: number | undefined = warnings.get(id);
      if (currentCount !== undefined) {
        if (--currentCount < 1) {
          logger.debug(`Cleared possible spam data of ${message.author.username}`)
          warnings.delete(id);
        } else {
          warnings.set(id, currentCount);
        }
      }
    }, subtractDelay);
    return;
  }
}