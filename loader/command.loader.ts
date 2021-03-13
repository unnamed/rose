import { walkSync } from "https://deno.land/std@0.67.0/fs/mod.ts";
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