import {Push} from './github.events';
import {Client, MessageEmbed, TextChannel} from 'discord.js';
import config from '../../config';

export default async (client: Client, event: Push) => {
	const channel = await client.channels.fetch('805139625256419338') as TextChannel;
	const branch = event.ref.split('/').pop();
	const repo = event.repository.full_name;
	await channel.send(
		new MessageEmbed()
			.setColor(config.color)
			.setAuthor(
				`${repo}:${branch}`,
				channel.guild.iconURL({ size: 64, format: 'png' })
			)
			.setDescription(event.commits.map(commit => `[\`${commit.id.substring(0, 6)}\`](${commit.url})  ${commit.message}`).join('\n'))
	);
}