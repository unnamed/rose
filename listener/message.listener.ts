import { Guild, Message, Member, logger } from "../deps.ts";
import config from "../config.js";
import { mute } from "../moderation/mute.handler.ts";
import { formatUser, wrapCode } from "../util/mod.ts";
import { dispatch } from "../command/command.manager.ts";

/**
 * Map containing all the user
 * identifiers that are in cooldown.
 * 
 * When a user sends a message being
 * in this map, the value is incremented.
 */
const warnings = new Map<string, number>();
const commandPrefix = "-";
const subtractDelay = 5_000;

export default {
  event: "messageCreate",
  execute: (message: Message) => {
    if (!message.author.bot) {

      let content = message.content;
      if (content.startsWith(commandPrefix)) {
        content = content.slice(commandPrefix.length);
        let args = content.split(" ");
        dispatch(message, args).catch(console.error);
      }

      let id: string = message.author.id;
      let count: number = warnings.get(id) || 0;
      warnings.set(id, ++count);
  
      if (count == 5) {
        message.channel?.send({
          embed: {
            title: "Hey! Slow down!",
            description: "Please don't send too many messages (8 messages in 5 seconds as maximum)",
            color: config.color,
            author: {
              name: message.guild?.name,
              icon_url: message.guild?.iconURL(32, 'png')
            }
          }
        });
      } else if (count == 8) {
        message.channel?.send({
          embed: {
            title: "Muted!",
            description: "You have been muted for flooding",
            color: config.color,
            thumbnail: {
              url: message.member?.avatarURL
            },
            fields: [{
              name: "User",
              value: wrapCode("brainfuck", formatUser(message.author))
            }]
          }
        });
        mute(message.member as Member, message.guild as Guild);
      }
  
      setTimeout(() => {
        let currentCount: number | undefined = warnings.get(id);
        if (currentCount !== undefined) {
          if (--currentCount < 1) {
            logger.debug(`[Slowdown Listener] Cleared data of ${message.author.username}`)
            warnings.delete(id);
          } else {
            warnings.set(id, currentCount);
          }
        }
      }, subtractDelay);
    }
  }
};