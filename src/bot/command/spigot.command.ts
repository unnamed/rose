import CommandBuilder from './command.builder';
import { findAuthor } from '../../util/spigot';
import { FileSingletonDatastore } from '../../data/FileSingletonDatastore';

const discordToSpigotDatastore = new FileSingletonDatastore<string>('.', 'data', 'discord_to_spigot.json');
const spigotToDiscordDatastore = new FileSingletonDatastore<string>('.', 'data', 'spigot_to_discord.json');

export default new CommandBuilder()
  .setName('spigot')
  .setDescription('Verify your SpigotMC Forums account')
  .addStringOption(
    option => option
      .setName('username')
      .setDescription('Your exact SpigotMC Forums username')
      .setRequired(true)
  )
  .setExecutor(async interaction => {
    const { user } = interaction;

    {
      // check if this Discord user has a SpigotMC Forums account linked already
      const spigotId = await discordToSpigotDatastore.get(user.id);
      if (spigotId !== null) {
        throw {
          title: 'You already have a SpigotMC Forums account linked!',
          description: 'If you want to link a different account, unlink your current one first using the `/spigot-unlink` command.',
          ephemeral: true
        };
      }
    }

    const username = interaction.options.getString('username');
    const author = await findAuthor(username);
    if ((author as any).code === 404) {
      throw { title: 'Invalid SpigotMC Forums username', description: 'Can\'t find a SpigotMC author with that username.', ephemeral: true };
    }

    {
      // check if this SpigotMC Forums account is linked to a Discord user already
      const discordId = await spigotToDiscordDatastore.get(author.id);
      if (discordId !== null) {
        throw {
          title: 'This SpigotMC Forums account is already linked!',
          description: 'This SpigotMC Forums account is already verified for another Discord user.',
          ephemeral: true
        };
      }
    }

    const senderUsername = interaction.user.username;
    const expectedUsername = author?.identities?.discord;

    if (expectedUsername === undefined) {
      throw {
        title: 'Can\'t verify SpigotMC Forums account: No Discord Identity',
        description: 'You have not linked your Discord account to your SpigotMC account. (from SpigotMC Forums).\n\n'
            + 'Go to [your Contact Details page](https://www.spigotmc.org/account/contact-details) and set your '
            + 'Discord identity to `' + senderUsername + '`.',
        footer: {
          text: 'Please note that it can take some minutes until it fully updates.'
        },
        ephemeral: true
      };
    }

    if (senderUsername === expectedUsername) {
      await discordToSpigotDatastore.save(interaction.user.id, author.id);
      await spigotToDiscordDatastore.save(author.id, interaction.user.id);
      throw {
        title: `Verified SpigotMC Forums account: ${author.username}`,
        description: 'You have successfully verified your SpigotMC Forums account. If you' +
            ' have bought a premium resource, you can now use the `/request` command to request your products\' roles.',
        author: {
          name: author?.username,
          iconURL: author?.avatar
        },
        ephemeral: true
      };
    } else {
      throw {
        title: 'Can\'t verify SpigotMC Forums account: Different Discord Identity',
        description: `The Discord identity set on SpigotMC Forums for ${author.username} is \`${expectedUsername}\`, but you are \`${senderUsername}\`.`,
        footer: {
          text: 'Please note that updates can take some minutes until they can be recognized by the bot.'
        },
        ephemeral: true
      };
    }
  })
  .build();