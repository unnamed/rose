import {Client} from 'discord.js';
import logger from '../log';

import loadListeners from './loader/listener.loader';
import loadCommands from './loader/command.loader';

/**
 * Starts the Discord Bot service using the token
 * specified in the environment variables
 */
export default (): Client => {
  const client = new Client();

  client.on('ready', () => {
    logger.fine(`Discord Bot logged in as ${client.user.tag}`);
  });

  loadListeners(client);
  loadCommands();

  client.login(process.env.BOT_TOKEN)
    .catch(err => {
      logger.error('Discord Bot start failed!');
      console.error(err);
    });

  return client;
};