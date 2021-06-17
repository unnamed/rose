import {Push, Star} from './github.events';
import {Client, MessageEmbed, TextChannel} from 'discord.js';
import config from '../../config';

const handlers = new Map<string, (client: Client, data: any) => Promise<void>>();

/**
 * Calls the required handler for the
 * given event passing the given data
 * as argument
 */
export function handleData(client: Client, event: string, data: unknown): void {
	const handle = handlers.get(event);
	if (handle) {
		handle(client, data)
			.catch(console.error);
	}
}

//#region Handlers
handlers.set('push', async (client: Client, event: Push) => {
	const channel = await client.channels.fetch('805139625256419338') as TextChannel;
	const branch = event.ref.split('/').pop();
	const repo = event.repository.full_name;
	await channel.send(
		new MessageEmbed()
			.setColor(config.color)
			.setURL(event.compare)
			.setAuthor(
				`${repo} in ${branch} (${event.commits.length} commit(s))`,
				event.sender.avatar_url
			)
			.setDescription(
				event.commits.map(commit => `**•** ${commit.message}`).join('\n')
				+ `\n\t${event.sender.login}`
			)
	);
});

handlers.set('star', async (client: Client, event: Star) => {
	const channel = await client.channels.fetch('805139625256419338') as TextChannel;
	if (event.action === 'created') {
		await channel.send(
			new MessageEmbed()
				.setColor(config.color)
				.setTitle(`[${event.repository.full_name}] stared!`)
				.setAuthor(event.sender.login, event.sender.avatar_url, event.sender.html_url)
				.setURL(event.repository.url)
				.setDescription(`Thank you ${event.sender.login} for the star!`)
		);
	}
});
//#endregion