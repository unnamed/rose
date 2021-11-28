import {Client, CommandInteraction, Intents, MessageEmbed} from 'discord.js';
import logger from '../log';

import loadListeners from './loader/listener.loader';
import loadCommands from './loader/command.loader';
import config from '../../config';

/**
 * Starts the Discord Bot service using the token
 * specified in the environment variables
 */
export default async (): Promise<Client> => {
  const client = new Client({
    intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES ]
  });

  client.on('ready', () => {
    logger.fine(`Discord Bot logged in as ${client.user.tag}`);
  });

  await client.login(config.discord.token);
  const commands = await loadCommands(client);

  client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
      const commandInteraction = interaction as CommandInteraction;
      const command = commands.get(commandInteraction.commandName);
      if (command) {
        try {
          await command.executor(commandInteraction);
        } catch (thrown) {
          if (thrown.title !== undefined) {
            await commandInteraction.reply({ embeds: [ {
              color: config.color,
              ...thrown
            } as MessageEmbed ]});
          } else {
            console.error(thrown);
          }
        }
      }
    }
  });

  loadListeners(client);

  return client;
};