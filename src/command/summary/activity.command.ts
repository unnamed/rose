import {Command} from '../command';
import {Message, VoiceChannel} from 'discord.js';
import fetch from 'node-fetch';

const activities: { [name: string]: string } = {
	youtube: '755600276941176913',
	'betray.io': '773336526917861400',
	pokernight: '755827207812677713',
	'fishington.io': '814288819477020702'
};

const command: Command = {
	name: 'activity',
	category: 'misc',
	description: 'Add a voice activity to the specified channel',
	arguments: [
		{ type: 'message', name: 'message' },
		{ type: 'voice-channel', name: 'channel' },
		{ type: 'str', name: 'type' }
	],
	async execute(message: Message, channel: VoiceChannel, type: string) {

		if (!activities[type]) {
			throw {
				title: 'Unknown type: ' + type,
				description: 'Available types: youtube, betray.io, pokernight, fishington.io'
			};
		}

		const result = await fetch(
			`https://discord.com/api/v8/channels/${channel.id}/invites`,
			{
				method: 'POST',
				body: JSON.stringify({
					max_age: 86400,
					max_uses: 0,
					target_application_id: activities[type], // youtube watch
					target_type: 2, // embedded
					temporary: false,
					validate: null
				}),
				headers: {
					'Authorization': `Bot ${message.client.token}`,
					'Content-Type': 'application/json'
				}
			}
		);
		const invite = await result.json();
		const link = `https://discord.gg/${invite.code}`;
		throw {
			title: 'Here we go',
			description: `[Click here](${link}) to join.`
			+ ` You can copy and paste this link \`${link}\` to invite a friend.`
		};
	}
};

export default command;