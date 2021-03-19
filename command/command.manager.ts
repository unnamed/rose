import { 
  Command, 
  CommandParameter, 
  RestorableArgumentIterator, 
  ParseError
} from "./command.ts";
import { hasPermission } from "./command.util.ts";
import { answersCache } from "../storage/mod.ts";
import { Message } from "../deps.ts";
import { ArgumentParser } from "./argument/argument.parser.ts";
import config from "../config.ts";

export const registry = new Map<string, Command>();

const aliasesRegistry = new Map<string, Command>();
export const argumentParsers = new Map<string, ArgumentParser>();

export function register(command: Command): void {
  registry.set(command.name, command);
  if (command.aliases) {
    command.aliases.forEach(alias => aliasesRegistry.set(alias, command));
  }
}

export function findCommand(commandLabel: string): Command | undefined {
  commandLabel = commandLabel.toLowerCase();
  return registry.get(commandLabel) || aliasesRegistry.get(commandLabel);
}

function parse(message: Message, param: CommandParameter, args: RestorableArgumentIterator): any {

  let errorHeading = "";
  let errorMessage = "No types were specified for the parameter '" + param.name + "'";

  for (let type of param.type.split("|")) {
    type = type.trim();
    if (type === 'message') {
      return message;
    } else {
      let parser = argumentParsers.get(type);
      if (!parser) {
        errorHeading = "Unknown type";
        errorMessage = "No argument parser was registered for the type '" + type + "'";
      } else {
        try {
          return parser.parse(message, param, args);
        } catch (err) {
          if (err instanceof ParseError) {
            errorHeading = err.heading;
            errorMessage = err.message;
          } else {
            throw err;
          }
        }
      }
    }
  }

  throw new ParseError(errorHeading, errorMessage);
}

export async function dispatch(message: Message, args: string[]): Promise<void> {

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
          text: `Executed by ${message.author.username}`,
          icon_url: guild.iconURL(64, 'png')
        }
      }
    });
    return;
  }

  let commandArguments = command.arguments || [];
  // TODO: This must be made while parsing the arguments
  let requiredArgumentCount = commandArguments
    .filter(param => param.type !== 'message' && !param.optional)
    .length;

  if (args.length < requiredArgumentCount) {
    message.channel?.send({
      embed: {
        title: "Invalid Syntax Error",
        description: `You must provide at least **${requiredArgumentCount}** arguments`,
        color: config.color,
        footer: {
          text: `Executed by ${message.author.username}`,
          icon_url: message.guild?.iconURL(64, 'png')
        }
      }
    });
    return;
  }

  let parseResult = [];
  let argIterator = new RestorableArgumentIterator(args);

  for (let i = 0; i < commandArguments.length; i++) {
    let param = commandArguments[i];
    let cursorSnapshot = argIterator.cursor;

    try {
      parseResult.push(parse(message, param, argIterator));
    } catch (err) {
      if (err instanceof ParseError) {
        if (!param.optional) {
          message.channel?.send({
            embed: {
              title: `Parsing Error: ${err.heading}`,
              description: err.message,
              color: config.color
            }
          });
          return;
        } else {
          argIterator.cursor = cursorSnapshot;
          continue;
        }
      } else {
        throw err;
      }
    }
  }

  command.execute.apply(undefined, parseResult).catch(err => {
    let { heading, description } = err;
    if (heading || description) {
      message.channel?.send({
        embed: {
          title: heading,
          description: description,
          color: config.color,
          footer: {
            text: `Requested by ${message.author.username}`,
            icon_url: message.member?.avatarURL
          }
        }
      });
    } 
  });
}