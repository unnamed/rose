import {Push} from './github.events';
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
			.setTitle(`[${repo}:${branch}] ${event.commits.length} new commits`)
			.setURL(event.compare)
			.setAuthor(event.sender.login, event.sender.avatar_url, event.sender.html_url)
			.setDescription(
				event.commits.map(commit => `[${commit.id.substring(0, 6)}](${commit.url}) ${commit.message}`)
			)
	);
});
//#endregion