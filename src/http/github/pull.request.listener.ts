import {PullRequestEvent} from './github.events';
import {Client, MessageEmbed, TextChannel} from 'discord.js';
import config from '../../../config';

const supportedActions: string[] = ['opened', 'reopened', 'closed'];

export default async (client: Client, event: PullRequestEvent) => {
  // TODO: Move this
  const channel = await client.channels.fetch('805139625256419338') as TextChannel;
  if (supportedActions.includes(event.action)) {
    const embed = new MessageEmbed()
      .setColor(config.color)
      .setAuthor(
        `${event.repository.full_name} | Pull request ${event.action} by ${event.sender.login}`,
        channel.guild.iconURL({size: 64, format: 'png'}),
        event.pull_request.html_url
      )
      .setTitle(`#${event.number} ${event.pull_request.title}`);

    if (event.action === 'opened') {
      embed.setDescription(event.pull_request.body);
    }

    await channel.send({ embeds: [embed] });
  }
};