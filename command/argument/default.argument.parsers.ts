import { argumentParsers } from "../command.manager.ts";
import { CommandParameter, ArgumentIterator } from "../command.ts";
import { ArgumentParser } from "./argument.parser.ts";
import { Message } from "../../deps.ts";

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