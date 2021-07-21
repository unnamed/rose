import {Command} from '../command';
import config from '../../config.js';
import {Message, TextChannel} from 'discord.js';

const command: Command = {
  name: 'announce',
  category: 'hidden',
  description: 'Announce something',
  arguments: [
    {type: 'message'},
    {
      type: '...str',
      name: 'title> | <description',
      defaultValue: null
    }
  ],
  execute: async (message: Message, announcement: string) => {
    if (!config.developers.includes(message.author.id)) {
      throw {title: 'No permission', description: 'Only bot developers can use this command'};
    }

    const args = announcement.split('|');
    const title = args[0].trim();
    const description = args[1].trim();
    const channel = message.guild.channels.cache.get('683903931424047124') as TextChannel;

    channel?.send({
      embed: {
        title,
        description,
        color: config.color,
        author: {
          name: message.guild?.name,
          iconURL: message.guild.iconURL({size: 64, format: 'png'})
        },
        footer: {
          text: 'Unnamed Bot'
        }
      }
    });
  }
};

export default command;