import {GuildMember, TextChannel} from 'discord.js';
import config from '../../config';

export default {
  event: 'guildMemberAdd',
  execute: async (member: GuildMember) => {
    if (member.user.bot) {
      // don't announce bot joins
      return;
    }

    // TODO: de-hardcode channels
    const channel = (await member.guild.channels.resolve('685983240192000006')) as TextChannel;

    await channel.send({
      embed: {
        description: 'A new user joined the server, say welcome!',
        color: config.color,
        author: {
          name: `Welcome ${member.user.username}!`,
          iconURL: member.user.displayAvatarURL({
            size: 32,
            format: 'png'
          })
        }
      }
    });
  }
};