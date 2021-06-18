import {Command} from '../command';
import {Message} from 'discord.js';

const command: Command = {
	name: 'eval',
	category: 'hidden',
	description: 'Code execution',
	arguments: [
		{ type: 'message', name: 'message' },
		{ type: '...str', name: 'code' }
	],
	async execute(message: Message, code: string) {
		if (message.author.id === '593188834112700418') {
			try {
				const result = eval(code);
				await message.channel.send('```' + result + '```');
			} catch (e) {
				await message.channel.send('```' + e + '```');
			}
		} else {
			await message.channel.send('no');
		}
	}
};

export default command;