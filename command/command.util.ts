import { Command, CommandParameter } from "./command.ts";
import { DiscordenoMessage, botHasChannelPermissions, hasChannelPermissions } from "../deps.ts";

export async function hasPermission(message: DiscordenoMessage, command: Command): Promise<boolean> {
  let guild = message.guild;
  let member = message.member;
  if (!guild || !member) {
    return false;
  } else if (command.permissions) {
    let botPermissed = await botHasChannelPermissions(guild.id, command.permissions.execute || []);
    let userPermissed = await hasChannelPermissions(member.id, guild.id, command.permissions.use || []);
    if (!botPermissed || !userPermissed) {
      return false;
    }
  }
  return true;
}
export function getLineRepresentation(param: CommandParameter): string | undefined {
  /*for (let type of param.type.split("|")) {
    type = type.trim();
    let parser = elementCreators.get(type)?.apply(undefined, param);
    if (parser) {
      let repr = parser.getRepresentation(param);
      if (repr) {
        return repr;
      }
    }
  }*/
  return undefined;
}

export function getUsage(command: Command): string {
  let usage = "-";
  usage += command.name + " ";
  usage += command.arguments
      ?.map(getLineRepresentation)
      .filter(repr => repr !== undefined)
      .join(" ");
  return usage.trim();
}