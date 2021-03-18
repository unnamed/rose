import { Command, CommandParameter } from "./command.ts";
import { Message, botHasPermission, memberIDHasPermission } from "../deps.ts";

export async function hasPermission(message: Message, command: Command): Promise<boolean> {
  let guild = message.guild;
  let member = message.member;
  if (!guild || !member) {
    return false;
  } else if (command.permissions) {
    let botPermissed = await botHasPermission(guild.id, command.permissions.execute || []);
    let userPermissed = await memberIDHasPermission(member.id, guild.id, command.permissions.use || []);
    if (!botPermissed || !userPermissed) {
      return false;
    }
  }
  return true;
}
export function getLineRepresentation(parameter: CommandParameter): string {
  let suffix = parameter.infinite ? "..." : "";
  if (parameter.optional) {
    return `[${parameter.name}${suffix}]`;
  } else {
    return `<${parameter.name}${suffix}>`;
  }
}

export function getUsage(command: Command): string {
  let usage = "-";
  usage += command.name + " ";
  usage += command.arguments
      ?.filter(arg => arg.type !== 'message')
      .map(getLineRepresentation)
      .join(" ");
  return usage;
}