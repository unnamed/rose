import { UserPayload, getMember, Guild, Member } from "../deps.ts";

export async function findMember(guild: Guild, id: string): Promise<Member | undefined> {
  let member = guild.members.get(id);
  if (member) {
    return member;
  } else {
    return getMember(guild.id, id, { force: true });
  }
}

export function formatUser(user: UserPayload): string {
  return `${user.username}#${user.discriminator} (${user.id})`;
}