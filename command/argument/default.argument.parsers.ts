import { argumentParsers } from "../command.manager.ts";
import { CommandParameter, ArgumentIterator, ParseError } from "../command.ts";
import { ArgumentParser } from "./argument.parser.ts";
import { Message } from "../../deps.ts";
import { findMember } from "../../util/mod.ts";

const tagRegex = new RegExp(/.+#[0-9]{4}$/g);
const snowflakeRegex = new RegExp(/[0-9]{18}$/g);
const mentionRegex = new RegExp(/<@!([0-9]{18})>$/g);

///
/// Member argument parser, resolves
/// ids, tags and mentions
///
argumentParsers.set(
  "member",
  new class extends ArgumentParser {
    async parse(message: Message, spec: CommandParameter, args: ArgumentIterator) {
      let guild = message.guild;
      if (!guild) {
        throw new ParseError("Not in a guild", "This command must be executed in a guild!");
      }
      let member: string = args.next();

      let found = undefined;
      // check if it's an ID
      if (member.match(snowflakeRegex)) {
        found = await findMember(guild, member);
      }
      // check if it's a mention
      if (!found) {
        let matches = member.matchAll(mentionRegex);
        if (matches) {
          //matches.next();
          let match = matches.next()?.value;
          if (match) {
            let id = match[1];
            found = await findMember(guild, id);
          }
        }
      } 
      // check if it's a tag
      if (!found && member.match(tagRegex)) {
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
          `A member with ID or tag \`${member}\` cannot be found.
          **Note:** Tags only work when the member is cached.`
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
    async parse(message: Message, spec: CommandParameter, args: ArgumentIterator) {
      return message;
    }
    getRepresentation(spec: CommandParameter) {
      return undefined;
    }
  }
);

///
/// Integer argument parser, converts
/// strings to ints using the parseInt
/// function and throws an error when
/// it's NaN
///
argumentParsers.set(
  "int",
  new class extends ArgumentParser {
    async parse(message: Message, spec: CommandParameter, args: ArgumentIterator) {
      let arg = args.next();
      let value = parseInt(arg);
      if (isNaN(value)) {
        throw new ParseError(
          "You must provide a number",
          `The argument \`${arg}\` cannot be parsed as an integer!`
        );
      }
      return value;
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
    async parse(message: Message, spec: CommandParameter, args: ArgumentIterator) {
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