import { Permission } from "../deps.ts";

export class ParseError extends Error {

  constructor(
    public heading: string,
    message: string,
    public throwOnLastArg: boolean = true
  ) {
    super(message);
  }

}

export class ArgumentIterator {
  
  constructor(
    private args: string[],
    public cursor: number = 0
  ) {
  }

  hasNext(): boolean {
    return this.cursor < this.args.length;
  }

  next(): string {
    let cursor = this.cursor++;
    if (cursor >= this.args.length) {
      throw new ParseError(
        "More arguments are required",
        "You must provide more arguments to this command, see help using `-help`",
        false
      );
    } else {
      return this.args[cursor];
    }
  }

}

export interface CommandParameter {
  name?: string;
  optional?: boolean;
  infinite?: boolean;
  type: string;
}

// deno-lint-ignore no-explicit-any
export interface Command {
  name: string;
  category: string;
  description: string;
  permissions?: { use?: Permission[], execute?: Permission[] }
  aliases?: string[];
  arguments?: CommandParameter[];
  execute: (...args: any[]) => Promise<void>;
}