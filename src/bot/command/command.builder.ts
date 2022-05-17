import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionResolvable } from 'discord.js';

export type CommandExecutor = (interaction: CommandInteraction) => Promise<void>;

export interface Command {
  data: any,
  executor: CommandExecutor;
}

export default class CommandBuilder extends SlashCommandBuilder {

  private executor: CommandExecutor;
  private permissions: PermissionResolvable[];

  setExecutor(executor: CommandExecutor): CommandBuilder {
    this.executor = executor;
    return this;
  }

  build(): Command {
    return {
      data: this.toJSON(),
      executor: this.executor
    };
  }

}