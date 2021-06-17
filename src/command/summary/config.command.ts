import {Command} from '../command';
import {Message} from 'discord.js';

const command: Command = {
	name: 'config',
	description: 'Customize your experience by configuring some settings',
	category: 'configuration',
	arguments: [
		{ type: 'message', name: 'message' }
	],
	children: {
		test: {
			description: 'Test',
			arguments: [
				{ type: 'message', name: 'message' }
			],
			async execute(message: Message) {
				await message.channel.send('TEst 1');
			}
		},
		xdd: {
			description: 'test',
			arguments: [
				{ type: 'message', name: 'message' }
			],
			async execute(message: Message) {
				await message.channel.send('TEST 2');
			}
		}
	},
	async execute(message: Message) {
		await message.channel.send('non!');
	}
};

export default command;