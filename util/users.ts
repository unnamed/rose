import { UserPayload } from "../deps.ts";

export function formatUser(user: UserPayload): string {
  return `${user.username}#${user.discriminator} (${user.id})`;
}