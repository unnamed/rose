import {getMember, DiscordenoGuild, DiscordenoMember } from "../deps.ts";

export async function findMember(guild: DiscordenoGuild, id: bigint): Promise<DiscordenoMember | undefined> {
  let member = guild.members.get(id);
  if (member) {
    return member;
  } else {
    return getMember(guild.id, id, { force: true });
  }
}

export function formatUser(user: any): string {
  return `${user.username}#${user.discriminator} (${user.id})`;
}