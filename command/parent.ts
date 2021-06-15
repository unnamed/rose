import { CommandElement, ParseContext } from './parse.ts';
import { PartialCommand } from './command.ts';

/**
 * Represents a parent command element, it has
 * sub-commands and a root-command, at parsing,
 * it will check if the next string is a sub-command,
 * else, it will delegate the parsing to the
 * root command
 */
export class ParentCommandElement extends CommandElement {

  constructor(
    name: string,
    private children: Map<string, PartialCommand>,
    private root: CommandElement
  ) {
    super(name);
  }


  get representation(): string {
    let subCommandNames: string[] = [];
    for (let name of this.children.keys()) {
      subCommandNames.push(name);
    }
    return `${this.name} <${subCommandNames.join('|')}|<${this.root.representation}>>`;
  }

  async parse(context: ParseContext): Promise<void> {
    if (context.args.hasNext()) {
      let cursor = context.args.cursor;
      let subCommand = context.args.next();
      let command = this.children.get(subCommand);

      if (command == null) {
        context.args.cursor = cursor;
        // try as arguments
        await this.root.parse(context);
        return;
      }

      context.command = command;
      cursor = context.args.cursor;
      try {
        await command.element?.parse(context);
        return;
      } catch {
        context.args.cursor = cursor;
      }
    }

    await this.root.parse(context);
  }

};