import logger from '../log';
import { Command } from './command/command.builder';
import { Client, CommandInteraction, MessageEmbed } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../../config';

import AnnounceCommand from './command/announce.command';
import PingCommand from './command/ping.command';
import RepoCommand from './command/repo.command';

export default async function loadCommands(client: Client) {

  const commands = [
    AnnounceCommand,
    PingCommand,
    RepoCommand
  ];
  const commandMap = commands.reduce((map, command) => map.set(command.data.name, command), new Map<string, Command>());

  const guildId = '683899335405994062';
  const rest = new REST({version: '9'}).setToken(config.discord.token);

  await rest.put(
    Routes.applicationGuildCommands(client.application.id, guildId),
    { body: commands.map(command => command.data) }
  );

  logger.info(`Successfully loaded ${commands.length} commands`);

  // start listening for command interactions
  client.on('interactionCreate', async interaction => {

    if (!interaction.isCommand()) {
      return;
    }

    const commandInteraction = interaction as CommandInteraction;
    const command = commandMap.get(commandInteraction.commandName);

    if (!command) {
      return;
    }

    try {
      await command.executor(commandInteraction);
    } catch (thrown) {
      if (thrown.title !== undefined) {
        await commandInteraction.reply({
          embeds: [
            {
              color: config.color,
              ...thrown
            } as MessageEmbed
          ]
        });
      } else {
        console.error(thrown);
      }
    }
  });
}