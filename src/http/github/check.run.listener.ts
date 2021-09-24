import {Client, MessageEmbed, TextChannel} from 'discord.js';
import {CheckRun} from './github.events';
import config from '../../config';

export default async (client: Client, event: CheckRun) => {

  const { title, summary } = event.check_run.output;

  if (!title || !summary) {
    // temporal bugfix, don't send anything if title or
    // summary are null
    return;
  }

  // TODO: de-hardcode channels!
  const channel = await client.channels.fetch('805139625256419338') as TextChannel;
  const iconURL = channel.guild.iconURL({size: 64, format: 'png'});

  await channel.send({ embeds: [
    new MessageEmbed()
      .setColor(config.color)
      .setAuthor(
        `${event.repository.full_name} | ${title}`,
        iconURL,
        event.repository.html_url
      )
      .setDescription(summary)
  ]});
};