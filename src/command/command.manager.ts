import {Command, PartialCommand} from './command';
import {ArgumentIterator, ElementCreator, ParseContext, ParseError} from './parse';
import {CommandElementCompound} from './compound';
import {ParentCommandElement} from './parent';
import config from '../config.js';
import {Message} from 'discord.js';
import {hasPermissions} from './command.util';
import logger from '../log';

export const registry = new Map<string, Command>();
export const elementCreators = new Map<string, ElementCreator>();
const aliasesRegistry = new Map<string, Command>();

function processElements(name: string, command: PartialCommand): PartialCommand {

  const elements = command.arguments.map(param => {
    const create = elementCreators.get(param.type);
    if (!create) {
      throw new Error(`No creator registered for type ${param.type}`);
    }
    return create(param);
  });
  const root = new CommandElementCompound(name, elements);

  command.executeRaw = async (context: ParseContext): Promise<void> => {
    const args = [];
    elements.forEach(e => args.push(context.values.get(e)));
    await command.execute.apply(undefined, args);
  };

  if (command.children) {
    const children = new Map<string, PartialCommand>();
    for (const subName in command.children) {
      const subCommand: PartialCommand = command.children[subName];
      children.set(subName, processElements(subName, subCommand));
    }
    command.element = new ParentCommandElement(name, children, root);
  } else {
    command.element = root;
  }

  return command;
}

export function register(command: Command): void {
  processElements(command.name, command);
  // save the commands to the map
  registry.set(command.name, command);
  if (command.aliases) {
    command.aliases.forEach(alias => aliasesRegistry.set(alias, command));
  }
}

export async function dispatch(message: Message, args: string[]): Promise<void> {

  const commandLabel = args.shift()?.toLowerCase();
  const command: Command | undefined = registry.get(commandLabel) ?? aliasesRegistry.get(commandLabel);
  const guild = message.guild;
  const member = message.member;

  if (!guild || !member || !command) {
    return;
  }

  if (hasPermissions(message, command)) {
    message.channel?.send({
      embed: {
        title: 'No Permission!',
        description: 'Sorry, the bot or you don\'t have the required permissions to execute/use the command :(',
        color: config.color,
        footer: {
          text: `Executed by ${message.author.username}`,
          iconURL: guild.iconURL({size: 64, format: 'png'})
        }
      }
    });
    return;
  }

  const context = new ParseContext(
    new ArgumentIterator(args),
    command
  );
  context.variables.set('message', message);
  context.parse()
    .then(result => result.executeRaw(context))
    .catch(result => {
      if (result instanceof ParseError) {
        // TODO: Make it translatable
        message.channel.send({
          embed: {
            color: config.color,
            footer: {
              text: `Requested by ${message.author.username}`,
              iconURL: message.author.avatarURL()
            },
            title: result.title,
            description: result.message
          }
        });
        return;
      }

      if (!result.title) {
        logger.error(
          `Error occurred while executing ${command.name}.
						\tArguments: ${args}`
        );
        console.error(result);
        result = {
          title: 'Internal Error',
          description: 'An unexpected error has occurred, please inform an administrator.'
        };
      }
      message.channel.send({
        embed: {
          color: config.color,
          footer: {
            text: `Requested by ${message.author.username}`,
            iconURL: message.author.avatarURL()
          },
          ...result
        }
      });
    });
}