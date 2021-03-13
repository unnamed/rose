import { Message, Permission } from "https://deno.land/x/discordeno/mod.ts";

export type ArgumentParser<T> = (message: Message, spec: CommandParameter, args: RestorableArgumentIterator) => T;

export class ParseError extends Error {

  constructor(
    public heading: string,
    message: string
  ) {
    super(message);
  }

}

export class RestorableArgumentIterator {
  
  constructor(
    private args: string[],
    public cursor: number = 0
  ) {
  }

  [Symbol.iterator]() {
    return this;
  }

  next(): { value: string, done: boolean } {
    return {
      value: this.args[this.cursor++],
      done: this.cursor > this.args.length
    };
  }

  clone(): RestorableArgumentIterator {
    return new RestorableArgumentIterator(
      // copies are unnecessary here, argument
      // array is supposed to be immutable
      this.args, 
      this.cursor
    );
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
  execute: (...args: any[]) => void;
}