import fs from 'fs';
import logger from '../../log';
import {Command} from '../command/command.builder';
import {Client} from 'discord.js';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import config from '../../../config';

const extension = '.js';
const suffix = `.command${extension}`;

export default async function loadCommands(client: Client): Promise<Map<string, Command>> {

  const promises = fs.readdirSync(`${__dirname}/../command/summary`)
    .filter(name => name.endsWith(suffix))
    .map((name) => {
      const canonName = name.slice(0, -extension.length);
      return import(`../command/summary/${canonName}`).then(mod => mod.default);
    });

  const commands = (await Promise.all(promises)) as Command[];
  const commandMap = new Map<string, Command>();

  commands.forEach(command => commandMap.set(command.data.name, command));

  const guildId = '683899335405994062';
  const rest = new REST({ version: '9' })
    .setToken(config.discord.token);

  const response = await rest.put(
    Routes.applicationGuildCommands(client.application.id, guildId),
    {
      body: commands.map(command => command.data)
    }
  );

  for (const entry of (response as any[])) {
    const command = commandMap.get(entry.name);
    if (command && command.permissions !== undefined) {
      const body = {
        id: '683899644476260534',
        type: 1, // 1: ROLE, 2: USER
        permission: true
      };
      await rest.patch(
        Routes.applicationGuildCommand(client.application.id, guildId, entry.id),
        { body }
      );
    }
  }

  logger.info(`Successfully loaded ${commands.length} commands`);
  return commandMap;
}