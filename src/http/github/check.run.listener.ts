import {Client, MessageEmbed, TextChannel} from 'discord.js';
import {CheckRun} from './github.events';
import config from '../../config';

export default async (client: Client, event: CheckRun) => {
  // TODO: de-hardcode channels!
  const channel = await client.channels.fetch('805139625256419338') as TextChannel;
  const iconURL = channel.guild.iconURL({size: 64, format: 'png'});

  await channel.send(
    new MessageEmbed()
      .setColor(config.color)
      .setAuthor(
        `${event.repository.full_name} | ${event.check_run.output.title}`,
        iconURL,
        event.repository.html_url
      )
      .setDescription(event.check_run.output.summary)
  );
};