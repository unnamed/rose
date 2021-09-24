import config from '../../../config.js';
import {TextChannel} from 'discord.js';
import CommandBuilder from '../command.builder';

export default new CommandBuilder()
  .setName('announce')
  .setDescription('Announce something')
  .addStringOption(
    option => option
      .setName('title')
      .setDescription('Announcement Title')
      .setRequired(true)
  )
  .addStringOption(
    option => option
      .setName('description')
      .setDescription('Announcement Description')
      .setRequired(true)
  )
  .setExecutor(async interaction => {

    if (!config.developers.includes(interaction.user.id)) {
      throw {title: 'No permission', description: 'Only bot developers can use this command'};
    }

    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const channel = interaction.guild.channels.cache.get('683903931424047124') as TextChannel;

    channel?.send({
      embeds: [{
        title,
        description,
        color: config.color,
        author: {
          name: interaction.guild?.name,
          iconURL: interaction.guild.iconURL({size: 64, format: 'png'})
        },
        footer: {
          text: 'Unnamed Bot'
        }
      }]
    });
  })
  .build();