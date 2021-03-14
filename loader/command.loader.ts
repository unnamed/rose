import { walkSync } from "../deps.ts";
import { register } from "../command/command.manager.ts";
import { Command } from "../command/command.ts";

export default async function loadCommands() {
  for (let entry of walkSync("./command/summary/")) {
    if (entry.path.endsWith("ts")) {
      let command = (await import("../" + entry.path)).default;
      register(command as Command);
    }
  }
}