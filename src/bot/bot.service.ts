import { Client, Intents } from 'discord.js';
import { exec } from 'child_process';

import loadCommands from './command.loader';
import config from '../../config';
import signale from 'signale';

/**
 * Starts the Discord Bot service using the token
 * specified in the environment variables
 */
export default async (): Promise<Client | null> => {
  const client = new Client({
    intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES ]
  });

  client.on('ready', () => {
    signale.success('Discord Bot logged in as %s', client.user.tag);

    // get git last commit and fetch
    exec('git rev-parse HEAD', (err, out) => {
      client.user.setPresence({
        status: 'dnd',
        activities: [
          {
            type: 'PLAYING',
            name: err ? 'Unknown' : out.trim().substring(0, 8)
          }
        ]
      });
      if (err) {
        signale.error('Failed to check git last commit');
        signale.error(err);
      }
    });
  });

  if (config.discord.token) {
    await client.login(config.discord.token);
    await loadCommands(client);
    return client;
  } else {
    signale.info('No Discord Bot token specified, bot won\'t start');
    return null;
  }
};