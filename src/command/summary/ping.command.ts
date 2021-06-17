import {Command} from '../command';
import {Message} from 'discord.js';

const command: Command = {
	name: 'ping',
	description: 'Check the bot internet connection',
	category: 'misc',
	arguments: [
		{ type: 'message', name: 'message' }
	],
	async execute(message: Message): Promise<void> {
		const ping = (Date.now() - message.createdTimestamp) / 1000;
		throw {
			title: 'Pong!',
			description: `The bot ping is \`${ping}\` seconds`
		};
	}
};

export default command;