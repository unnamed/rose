import {Push} from './github.events';
import {Client, MessageEmbed, TextChannel} from 'discord.js';
import config from '../../config';

let lastEmbedMessageId: string | undefined = undefined;

export default async (client: Client, event: Push) => {
  const channel = await client.channels.fetch('805139625256419338') as TextChannel;
  const branch = event.ref.split('/').pop();
  const repo = event.repository.full_name;

  const history = event.commits
    .map(commit => `[\`${commit.id.substring(0, 6)}\`](${commit.url})  ${commit.message}`)
    .join('\n');

  const title = `${repo}:${branch}`;
  const iconURL = channel.guild.iconURL({size: 64, format: 'png'});

  async function sendNewEmbed() {
    lastEmbedMessageId = (await channel.send({ embeds: [
      new MessageEmbed()
        .setColor(config.color)
        .setAuthor(title, iconURL, event.repository.url)
        .setDescription(history)
    ]})).id;
  }

  if (!lastEmbedMessageId) {
    await sendNewEmbed();
  } else {
    const lastEmbedMessage = await channel.messages.fetch(lastEmbedMessageId);
    const lastEmbed = lastEmbedMessage.embeds[0];

    if (lastEmbed.author.name !== title
      || (lastEmbed.description.match(/\n/g) ?? []).length > 7) {
      await sendNewEmbed();
    } else {
      await lastEmbedMessage.edit({ embeds: [
        new MessageEmbed()
          .setColor(config.color)
          .setAuthor(title, iconURL, event.repository.url)
          .setDescription(lastEmbed.description + '\n' + history)
      ]});
    }
  }
};