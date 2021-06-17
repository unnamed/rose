import {Push} from './github.events';
import {Client, TextChannel} from 'discord.js';
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
	await channel.send({
		embed: {
			color: config.color,
			title: 'Push',
			description: event.commits.map(commit => commit.message).join('\n')
		}
	});
});
//#endregion