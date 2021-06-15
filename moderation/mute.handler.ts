import { DiscordenoRole, DiscordenoGuild, DiscordenoMember } from "../deps.ts";

export async function getMutedRole(guild: DiscordenoGuild): Promise<DiscordenoRole | undefined> {
  let mutedRole: DiscordenoRole | undefined = undefined;
  for (let role of guild.roles.values()) {
    if (role.name.toLowerCase() === 'muted') {
      mutedRole = role;
      break;
    }
  }
  return mutedRole;
}

export async function mute(member: DiscordenoMember, guild: DiscordenoGuild): Promise<void> {
  let role = await getMutedRole(guild);
  if (role) {
    member.addRole(guild.id, role.id, "Mute");
  }
}