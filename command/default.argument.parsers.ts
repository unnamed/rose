import { elementCreators } from "./command.manager.ts";
import { CommandElement, ParseContext, ParseError } from "./parse.ts";
import { CommandParameter } from "./command.ts";
import { findMember } from "../util/mod.ts";

const tagRegex = new RegExp(/.+#[0-9]{4}$/g);
const snowflakeRegex = new RegExp(/[0-9]{18}$/g);
const mentionRegex = new RegExp(/<@!([0-9]{18})>$/g);

///
/// Member argument parser, resolves
/// ids, tags and mentions
///
elementCreators.set(
  "member",
  (spec: CommandParameter) => {
    return new class extends CommandElement {

      constructor() {
        super(spec.name as string);
      }

      async parse(context: ParseContext): Promise<void> {
        let message = context.variables.get("message");
        let guild = message.guild;
        if (!guild) {
          throw new ParseError("Not in a guild", "This command must be executed in a guild!");
        }
        let member: string = context.args.next();
  
        let found = undefined;
        // check if it's an ID
        if (member.match(snowflakeRegex)) {
          found = await findMember(guild, BigInt(member));
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
    };
  }
);

///
/// Message argument "parser", doesn't
/// consume arguments, so it's really
/// an argument "injector"
/// 
elementCreators.set(
  "message",
  (spec: CommandParameter) => new class extends CommandElement {
    constructor() {
      super(spec.name as string);
    }

    async parse(context: ParseContext): Promise<void> {
      context.values.set(this, context.variables.get('message'));
    }
  }
);

///
/// Integer argument parser, converts
/// strings to ints using the parseInt
/// function and throws an error when
/// it's NaN
///
elementCreators.set(
  "int",
  (spec: CommandParameter) => new class extends CommandElement {
    constructor() {
      super(spec.name as string);
    }

    async parse(context: ParseContext): Promise<void> {
      let arg = context.args.next();
      let value = parseInt(arg);
      if (isNaN(value)) {
        throw new ParseError(
          "invalid-int",
          "Invalid Argument: Not an integer"
        );
      }
      context.values.set(this, value);
    }
  }
);

///
/// Dummy argument "parser", it
/// returns a single string
///
elementCreators.set(
  "str",
  (spec: CommandParameter) => new class extends CommandElement {

    constructor() {
      super(spec.name as string);
    }

    async parse(context: ParseContext): Promise<void> {
      context.values.set(this, context.args.next());
    }

  }
);

///
/// String argument "parser", the arguments
/// are already strings, so parsing isn't necessary
/// but this argument "parser" joins all the
/// args into a single string
///
elementCreators.set(
  "...str",
  (spec: CommandParameter) => new class extends CommandElement {

    constructor() {
      super(spec.name as string);
    }

    async parse(context: ParseContext): Promise<void> {
      // Initialize with an argument because
      // at least one argument is required
      let result: string[] = [];
      do {
        result.push(context.args.next());
      } while (context.args.hasNext());
      context.values.set(this, result.join(" "));
    }

    get representation(): string {
      return `<${this.name}...>`;
    }

  }
);