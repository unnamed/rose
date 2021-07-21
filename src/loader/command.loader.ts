import fs from 'fs';
import logger from '../log';
import {register} from '../command/command.manager';
import {Command} from '../command/command';

import '../command/default.elements';

const extension = '.js';
const suffix = `.command${extension}`;

export default function loadCommands() {
  const count = fs.readdirSync(`${__dirname}/../command/summary`)
    .filter(name => name.endsWith(suffix))
    .reduce((count, name) => {
      const canonName = name.slice(0, -extension.length);

      import(`../command/summary/${canonName}`)
        .then(command => register((command.default as Command)))
        .catch(console.error);

      return count + 1;
    }, 0);

  logger.info(`Successfully loaded ${count} commands`);
}