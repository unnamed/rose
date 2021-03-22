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
  abstract parse(message: Message, spec: CommandParameter, args: ArgumentIterator): Promise<any>;

  /**
   * Gets the argument representation
   * for the specified command parameter
   * specification
   */
  getRepresentation(spec: CommandParameter): string | undefined {
    return spec.defaultValue ? `[${spec.name}]` : `<${spec.name}>`;
  }

}