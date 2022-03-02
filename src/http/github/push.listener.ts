import {Push} from './github.events';
import {Client, MessageEmbed, TextChannel} from 'discord.js';
import config from '../../../config';

let lastEmbedMessageId: string | undefined = undefined;

export default async (client: Client, event: Push) => {
  const channel = await client.channels.fetch('805139625256419338') as TextChannel;

  // ref is always prefixed with "refs/heads/" or "refs/tags/"
  const ref = event.ref;
  const branch = ref.substring(ref.indexOf('/', 'refs/'.length) + 1);
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
    return;
  }

  channel.messages.fetch(lastEmbedMessageId)
    .then(lastEmbedMessage => {
      const lastEmbed = lastEmbedMessage.embeds[0];

      if (lastEmbed.author.name !== title
        || (lastEmbed.description.match(/\n/g) ?? []).length > 7) {
        sendNewEmbed().catch(console.error);
      } else {
        lastEmbedMessage.edit({ embeds: [
          new MessageEmbed()
            .setColor(config.color)
            .setAuthor(title, iconURL, event.repository.url)
            .setDescription(lastEmbed.description + '\n' + history)
        ]}).catch(console.error);
      }
    })
    .catch(() => sendNewEmbed());
};