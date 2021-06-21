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
					event.pull_request.repo.full_name,
					channel.guild.iconURL({ size: 64, format: 'png' }),
					event.pull_request.repo.url
				)
				.setDescription(
					`**Pull Request Opened** by ${event.pull_request.user.login}
					**#${event.number} ${event.pull_request.title}**
					> ${event.pull_request.body}
					[\`Visit\`](${event.pull_request.html_url})`
				)
		);
	}
};