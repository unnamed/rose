import CommandBuilder from '../command.builder';
import {Author, findAuthor} from '../../../util/spigot';

export default new CommandBuilder()
  .setName('spigot')
  .setDescription('Verify your Spigot account')
  .addStringOption(
    option => option
      .setName('username')
      .setDescription('Spigot Username')
      .setRequired(true)
  )
  .setExecutor(async interaction => {

    const username = interaction.options.getString('username');
    let author: Author;

    try {
      author = await findAuthor(username);
    } catch (e) {
      if (typeof e === 'string') {
        throw {
          title: 'Invalid Username',
          description: e
        };
      } else {
        // re-throw
        throw e;
      }
    }

    if (!author.identities) {
      throw {
        title: 'Invalid Username',
        description: 'Given user does not have linked identities'
      };
    }

    const discordIdentity = author.identities['discord'];
    if (discordIdentity === undefined || discordIdentity !== interaction.user.tag) {
      throw {
        title: 'Failed to verify',
        description: 'Please verify that you set your Discord tag in the "Discord" identity' +
          ' in [Contact Details](https://www.spigotmc.org/account/contact-details)'
      };
    }

    throw {
      title: 'Successfully verified!',
      description: `Successfully verified, hello ${author.username}`
    };
  })
  .build();