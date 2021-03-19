import { argumentParsers } from "../command.manager.ts";
import { CommandParameter, RestorableArgumentIterator } from "../command.ts";
import { ArgumentParser } from "./argument.parser.ts";
import { Message } from "../../deps.ts";

argumentParsers.set(
  "message",
  new class extends ArgumentParser {
    parse(message: Message, spec: CommandParameter, args: RestorableArgumentIterator) {
      return message;
    }
    getRepresentation(spec: CommandParameter) {
      return undefined;
    }
  }
);

argumentParsers.set(
  "str",
  new class extends ArgumentParser {
    parse(message: Message, spec: CommandParameter, args: RestorableArgumentIterator) {
      if (spec.infinite) {
        let result: string[] = [];
        for (let arg of args) {
          result.push(arg);
        }
        return result.join(" ");
      } else {
        return args.next().value;
      }
    }
  }
);