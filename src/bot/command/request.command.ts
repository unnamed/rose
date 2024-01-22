import config from '../../../config.js';
import CommandBuilder from './command.builder';
import { FileSingletonDatastore } from '../../data/FileSingletonDatastore';
import {submit} from "../../task/tasks";

const discordToSpigotDatastore = new FileSingletonDatastore<string>('.', 'data', 'discord_to_spigot.json');

export default new CommandBuilder()
  .setName('request')
  .setDescription('Make a request to the developers!')
  .let(b => b.addSubcommand(builder => builder
    .setName('productroles')
    .setDescription('Request a verification of your purchases to get your bought products\' roles.')))
  .setExecutor(async interaction => {
    const subcommand = interaction.options.getSubcommand(true);
    switch (subcommand) {
    case 'productroles': {
      const spigotId = await discordToSpigotDatastore.get(interaction.user.id);
      if (spigotId === null) {
        throw {
          title: 'You don\'t have a SpigotMC Forums account linked!',
          description: 'To link your SpigotMC Forums account, use the `/spigot` command.',
          color: config.color,
          ephemeral: true
        };
      }
      await submit(interaction.client, {
        description: 'Verify my products and give me my roles.',
        submittedBy: {
          id: interaction.user.id,
          name: interaction.user.username,
          spigotId: spigotId
        }
      });
      throw {
        title: 'Request sent',
        description: 'Your request has been sent to the developers, please wait patiently for an action.',
        color: config.color,
        ephemeral: true
      };
    }
    default: {
      throw {
        title: 'Unknown request type',
        description: 'You tried to submit an unknown request type, please re-check the available sub-commands.',
        color: config.color,
        ephemeral: true
      };
    }
    }
  })
  .build();