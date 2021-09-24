import {Star} from './github.events';
import {Client, MessageEmbed, TextChannel} from 'discord.js';
import config from '../../config';

import onPush from './push.listener';
import onPullRequest from './pull.request.listener';
import onCheckRun from './check.run.listener';

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
handlers.set('push', onPush);
handlers.set('pull_request', onPullRequest);
handlers.set('check_run', onCheckRun);
handlers.set('star', async (client: Client, event: Star) => {
  const channel = await client.channels.fetch('805139625256419338') as TextChannel;
  if (event.action === 'created') {
    await channel.send({ embeds: [
      new MessageEmbed()
        .setColor(config.color)
        .setTitle(`[${event.repository.full_name}] stared!`)
        .setAuthor(event.sender.login, event.sender.avatar_url, event.sender.html_url)
        .setURL(event.repository.html_url)
        .setDescription(`Thank you ${event.sender.login} for the star!`)
    ]});
  }
});
//#endregion