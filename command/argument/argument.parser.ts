import { Message } from "../../deps.ts";
import { CommandParameter, ArgumentIterator } from "../command.ts";

/**
 * Represents an argument parser,
 * converts simple strings to a
 * handleable object
 */
export abstract class ArgumentParser {

  /**
   * Parses the given args to the
   * necessary type
   */
  abstract parse(message: Message, spec: CommandParameter, args: ArgumentIterator): any;

  /**
   * Gets the argument representation
   * for the specified command parameter
   * specification
   */
  getRepresentation(spec: CommandParameter): string | undefined {
    let suffix = spec.infinite ? "..." : "";
    let representation = spec.optional ? `[${spec.name}${suffix}]` : `<${spec.name}${suffix}>`;
    return representation;
  }

}