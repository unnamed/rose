import { argumentParsers } from "../command.manager.ts";
import { CommandParameter, ArgumentIterator, ParseError } from "../command.ts";
import { ArgumentParser } from "./argument.parser.ts";
import { Message } from "../../deps.ts";

const discriminatorSuffixRegex = new RegExp(/#[0-9]{4}$/g);

///
/// Member argument parser, resolves
/// ids, tags and mentions
///
argumentParsers.set(
  "member",
  new class extends ArgumentParser {
    parse(message: Message, spec: CommandParameter, args: ArgumentIterator) {
      let guild = message.guild;
      if (!guild) {
        throw new ParseError("Not in a guild", "This command must be executed in a guild!");
      }
      let member: string = args.next();
      let found = undefined;
      // check if it's an ID
      if (member.length == 18) {
        let id = parseInt(member);
        if (!isNaN(id)) {
          found = guild.members.get(member);
        }
      }
      // check if it's a mention
      if (!found && member.length == 22 && member.startsWith("<@!") && member.endsWith(">")) {
        let id = parseInt(member.substring(3, member.length - 1));
        if (!isNaN(id)) {
          found = guild.members.get(member);
        }
      }
      // check if it's a tag
      if (!found && member.match(discriminatorSuffixRegex)) {
        for (let m of guild.members.values()) {
          let tag = m.username + "#" + m.discriminator;
          if (tag === member) {
            found = m;
            break;
          }
        }
      }

      if (found) {
        return found;
      } else {
        throw new ParseError(
          "Member not found",
          `A member with ID or tag \`${member}\` cannot be found`
        );
      }
    }
  }
)

///
/// Message argument "parser", doesn't
/// consume arguments, so it's really
/// an argument "injector"
/// 
argumentParsers.set(
  "message",
  new class extends ArgumentParser {
    parse(message: Message, spec: CommandParameter, args: ArgumentIterator) {
      return message;
    }
    getRepresentation(spec: CommandParameter) {
      return undefined;
    }
  }
);


///
/// String argument "parser", the arguments
/// are already strings, so parsing isn't necessary
/// but this argument "parser" checks for infinite
/// text arguments
///
argumentParsers.set(
  "str",
  new class extends ArgumentParser {
    parse(message: Message, spec: CommandParameter, args: ArgumentIterator) {
      if (spec.infinite) {
        // Initialize with an argument because
        // at least one argument is required
        let result: string[] = [args.next()];
        while (args.hasNext()) {
          result.push(args.next());
        }
        return result.join(" ");
      } else {
        return args.next();
      }
    }
  }
);