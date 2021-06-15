import { Permission } from '../deps.ts';
import { CommandElement } from './parse.ts';

export interface CommandParameter {
  name?: string;
  defaultValue?: any,
  type: string;
}

export interface PartialCommand {
  description: string;
  permissions?: { use?: Permission[], execute?: Permission[] };
  aliases?: string[];
  arguments?: CommandParameter[];
  element?: CommandElement; // internal use
  execute: (...args: any[]) => Promise<void>;
}

// deno-lint-ignore no-explicit-any
export interface Command extends PartialCommand {
  name: string;
  category: string;
  children?: { [name: string]: PartialCommand };
}