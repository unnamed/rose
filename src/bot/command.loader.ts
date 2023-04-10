import signale from 'signale';
import { Command } from './command/command.builder';
import {Client, CommandInteraction, MessageEmbed, Snowflake} from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../../config';

import AnnounceCommand from './command/announce.command';
import PingCommand from './command/ping.command';
import RepoCommand from './command/repo.command';

const COOLDOWN_EXPIRY_TIME = 5 * 1000;

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

  signale.success('Successfully loaded %s commands', commands.length);

  const commandCoolDownExpiryTimestamps = new Map<Snowflake, number>();

  // task to clean up the 'commandCoolDownExpiryTimestamps' map
  setInterval(() => {
    const now = Date.now();
    for (const [ id, expiry ] of commandCoolDownExpiryTimestamps) {
      if (expiry <= now) {
        commandCoolDownExpiryTimestamps.delete(id);
      }
    }
  }, 5000);

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

    const member = commandInteraction.member;
    const expiry = commandCoolDownExpiryTimestamps.get(member.user.id);
    const now = Date.now();

    // did it not expire yet?
    if (expiry !== undefined && expiry > now) {
      await commandInteraction.reply({
        ephemeral: true,
        embeds: [
          {
            title: 'Hey, you\'re going to burn your keyboard!',
            description: `You have to wait ${Math.round(COOLDOWN_EXPIRY_TIME / 1000)} seconds to do this again`,
            color: config.color,
          } as MessageEmbed
        ]
      });
      return;
    }

    commandCoolDownExpiryTimestamps.set(member.user.id, now + COOLDOWN_EXPIRY_TIME);

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