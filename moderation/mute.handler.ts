import { Role, Guild, Member } from "../deps.ts";

export async function getMutedRole(guild: Guild): Promise<Role | undefined> {
  let mutedRole: Role | undefined = undefined;
  for (let role of guild.roles.values()) {
    if (role.name.toLowerCase() === 'muted') {
      mutedRole = role;
      break;
    }
  }
  return mutedRole;
}

export async function mute(member: Member, guild: Guild): Promise<void> {
  let role = await getMutedRole(guild);
  if (role) {
    member.addRole(guild.id, role.id, "Mute");
  }
}