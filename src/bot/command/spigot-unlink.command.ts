import CommandBuilder from './command.builder';
import { FileSingletonDatastore } from '../../data/FileSingletonDatastore';

const discordToSpigotDatastore = new FileSingletonDatastore<string>('.', 'data', 'discord_to_spigot.json');
const spigotToDiscordDatastore = new FileSingletonDatastore<string>('.', 'data', 'spigot_to_discord.json');

export default new CommandBuilder()
  .setName('spigot-unlink')
  .setDescription('Unlink your SpigotMC Forums account from this Discord account')
  .setExecutor(async interaction => {
    const { user } = interaction;

    const spigotId = await discordToSpigotDatastore.get(user.id);
    if (spigotId === null) {
      throw {
        title: 'You don\'t have a SpigotMC Forums account linked!',
        description: 'To link your SpigotMC Forums account, use the `/spigot` command.'
      };
    }

    await discordToSpigotDatastore.remove(user.id);
    await spigotToDiscordDatastore.remove(spigotId);
    throw {
      title: 'Unlinked SpigotMC Forums account!',
      description: 'You have successfully unlinked your SpigotMC Forums account.'
    };
  })
  .build();