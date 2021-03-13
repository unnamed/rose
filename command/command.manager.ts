import { Command, RestorableArgumentIterator } from "./command.ts";

const registry = new Map<string, Command>();

export function register(command: Command): void {
  registry.set(command.name, command);
}

export async function dispatch(args: string[]): Promise<void> {
  let argIterator = new RestorableArgumentIterator(args);
  
}