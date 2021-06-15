import { DiscordenoGuild } from "../../deps.ts";

/**
 * Main directory for json
 * file storage
 */
export const dir = "./jsondata";

/**
 * Directory for containing
 * moderations per guild in 
 * json files
 */
export const moderationsDir = `${dir}/moderations`;

/**
 * Directory for containing
 * answers per guild in json
 * files
 */
export const answersDir = `${dir}/answers`;

/**
 * Gets the moderations json file for
 * the specified guild 
 */
export function getModerationsPath(guild: DiscordenoGuild): string {
  return `${moderationsDir}/${guild.id}.json`;
}

/**
 * Gets the answers json file for
 * the specified guild
 */
export function getAnswersPath(guild: DiscordenoGuild): string {
  return `${answersDir}/${guild.id}.json`;
}