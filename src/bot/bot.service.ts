import { Client, Intents } from 'discord.js';
import logger from '../log';

import loadCommands from './command.loader';
import config from '../../config';

/**
 * Starts the Discord Bot service using the token
 * specified in the environment variables
 */
export default async (): Promise<Client | null> => {
  const client = new Client({
    intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES ]
  });

  client.on('ready', () => {
    logger.fine(`Discord Bot logged in as ${client.user.tag}`);
  });

  if (config.discord.token) {
    await client.login(config.discord.token);
    await loadCommands(client);
    return client;
  } else {
    logger.info('No Discord token specified, bot won\'t start');
    return null;
  }
};