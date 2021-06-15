import { Command, PartialCommand, CommandParameter } from "./command.ts";
import { ParseContext, CommandElement, ArgumentIterator, ElementCreator } from './parse.ts';
import { CommandElementCompound } from './compound.ts';
import { ParentCommandElement } from './parent.ts';
import { hasPermission } from "./command.util.ts";
import { answersCache } from "../storage/mod.ts";
import { DiscordenoMessage } from "../deps.ts";
import config from "../config.js";

export const registry = new Map<string, Command>();
export const elementCreators = new Map<string, ElementCreator>();
const aliasesRegistry = new Map<string, Command>();

function getElements(parameters: CommandParameter[]): CommandElement[] {
  return parameters.map(param => {
    let create = elementCreators.get(param.type);
    if (!create) {
      throw new Error(`No creator registered for type ${param.type}`);
    }
    return create(param);
  });
}

export function register(command: Command): void {
  registry.set(command.name, command);
  if (command.aliases) {
    command.aliases.forEach(alias => aliasesRegistry.set(alias, command));
  }

  let root = new CommandElementCompound(
    command.name,
    getElements(command.arguments as CommandParameter[])
  );

  if (command.children) {
    let children = new Map<string, PartialCommand>();
    for (let subName in command.children) {
      children.set(subName, command.children[subName]);
    }
    command.element = new ParentCommandElement(command.name, children, root);
  } else {
    command.element = root;
  }
}

export function findCommand(commandLabel: string): Command | undefined {
  commandLabel = commandLabel.toLowerCase();
  return registry.get(commandLabel) || aliasesRegistry.get(commandLabel);
}

export async function dispatch(message: DiscordenoMessage, args: string[]): Promise<void> {

  let commandLabel = args.shift()?.toLowerCase() as string;
  let command: Command | undefined = findCommand(commandLabel);
  let guild = message.guild;
  let member = message.member;

  if (!guild || !member) {
    return;
  }

  if (!command) {
    let embedResponse = await answersCache.find([guild.id, commandLabel]);
    if (embedResponse) {
      message.channel?.send({ embed: embedResponse });
    }
    return;
  }

  if (!(await hasPermission(message, command))) {
    message.channel?.send({
      embed: {
        title: "No Permission!",
        description: "Sorry, the bot or you doesn't have the required permissions to execute/use the command :(",
        color: config.color,
        footer: {
          text: `Executed by ${message.member?.username}`,
          iconUrl: guild.iconURL(64, 'png')
        }
      }
    });
    return;
  }

  let context = new ParseContext(
    new ArgumentIterator(args),
    command
  );
  
  let executed = await context.parse();

  executed.execute.apply(undefined, [context]).catch(err => {
    if (err.title) {
      message.channel?.send({
        embed: {
          color: config.color,
          footer: {
            text: `Requested by ${message.member?.username}`,
            iconUrl: message.member?.avatarURL
          },
          ...err
        }
      });
    } 
  });
}