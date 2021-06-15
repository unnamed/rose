import { ModerationData } from "../types.ts";
import { DiscordenoGuild, readJson, writeJson, existsSync, ensureDir } from "../../deps.ts";
import { moderationsDir, getModerationsPath } from "./json.storage.ts";

type Moderations = { [target: string]: ModerationData }

export async function saveModeration(guild: DiscordenoGuild, moderation: ModerationData) {
  await ensureDir(moderationsDir);
  let path = getModerationsPath(guild);
  let moderations: Moderations;
  if (existsSync(path)) {
    moderations = (await readJson(path)) as Moderations;
  } else {
    moderations = {};
  }
  let storedData: any = {...moderation};
  delete storedData.guild;
  delete storedData.target;
  moderations[moderation.target] = storedData;
  await writeJson(path, moderations);
}