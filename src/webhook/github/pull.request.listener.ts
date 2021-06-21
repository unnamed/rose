import {PullRequestEvent} from './github.events';
import {Client, MessageEmbed, TextChannel} from 'discord.js';
import config from '../../config';

export default async (client: Client, event: PullRequestEvent) => {
	// TODO: Move this
	const channel = await client.channels.fetch('805139625256419338') as TextChannel;
	if (event.action === 'opened') {
		await channel.send(
			new MessageEmbed()
				.setColor(config.color)
				.setAuthor(
					`${event.repository.name} | Pull request opened by ${event.pull_request.user.login}`,
					channel.guild.iconURL({ size: 64, format: 'png' }),
					event.pull_request.html_url
				)
				.setTitle(`${event.number} ${event.pull_request.title}`)
				.setDescription(event.pull_request.body)
		);
	}
};