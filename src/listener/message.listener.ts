import config from '../config.js';
import {Message} from 'discord.js';
import {dispatch} from '../command/command.manager';
import logger from '../log';

/**
 * Map containing all the user
 * identifiers that are in cool-down.
 *
 * When a user sends a message being
 * in this map, the value is incremented.
 */
const warnings = new Map<string, number>();
const commandPrefix = '-';
const subtractDelay = 5_000;

export default {
	event: 'message',
	execute: async (message: Message) => {
		if (message.author.bot) {
			return;
		}

		let content: string = message.content;
		if (content.startsWith(commandPrefix)) {
			content = content.slice(commandPrefix.length);
			dispatch(message, content.split(/ +/g))
				.catch(console.error);
		}

		const id: string = message.author.id;
		let count: number = warnings.get(id) || 0;
		warnings.set(id, ++count);

		if (count == 5) {
			await message.channel.send({
				embed: {
					title: 'Hey! Slow down!',
					description: 'Please don\'t send too many messages (8 messages in 5 seconds as maximum)',
					color: config.color,
					author: {
						name: message.guild.name,
						iconURL: message.guild.iconURL({
							size: 32,
							format: 'png'
						})
					}
				}
			});
		} else if (count == 8) {
			await message.channel.send({
				embed: {
					title: 'Muted!',
					description: 'You have been muted for flooding',
					color: config.color,
					thumbnail: {
						url: message.author.avatarURL()
					},
					fields: [{
						name: 'User',
						value: `\`\`\`${message.author.tag}\`\`\``
					}]
				}
			});
		}

		setTimeout(() => {
			let currentCount: number | undefined = warnings.get(id);
			if (currentCount !== undefined) {
				if (--currentCount < 1) {
					logger.debug(`[Slowdown Listener] Cleared data of ${message.author.tag}`);
					warnings.delete(id);
				} else {
					warnings.set(id, currentCount);
				}
			}
		}, subtractDelay);
	}
};