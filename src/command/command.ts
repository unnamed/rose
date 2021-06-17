import {CommandElement, ParseContext} from './parse';
import {PermissionString} from 'discord.js';

export interface CommandParameter {
	name?: string;
	defaultValue?: any,
	type: string;
}

export interface PartialCommand {
	description: string;
	permissions?: { use?: PermissionString[], execute?: PermissionString[] };
	aliases?: string[];
	arguments?: CommandParameter[];
	children?: { [name: string]: PartialCommand },
	element?: CommandElement; // internal use
	executeRaw?: (context: ParseContext) => Promise<void>; // internal use
	execute: (...args: any[]) => Promise<void>;
}

// deno-lint-ignore no-explicit-any
export interface Command extends PartialCommand {
	name: string;
	category: string;
}