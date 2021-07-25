import fs from 'fs';
import {Client} from 'discord.js';
import logger from '../../log';

const extension = '.js';
const suffix = `.listener${extension}`;

export default (client: Client) => {
  const count = fs.readdirSync(`${__dirname}/../listener/`)
    .filter(name => name.endsWith(suffix))
    .reduce((count, name) => {
      const canonName = name.slice(0, -extension.length);

      import(`../listener/${canonName}`)
        .then(listener => {
          const { event, execute } = listener.default;
          client.on(event, execute);
        })
        .catch(console.error);

      return count + 1;
    }, 0);

  logger.info(`Successfully loaded ${count} event listeners`);
};