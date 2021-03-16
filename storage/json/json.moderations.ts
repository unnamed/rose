import { ModerationData } from "./types.ts";
import { Guild, readJson, writeJson, existsSync, ensureDir } from "../deps.ts";

const jsonDataDir = "./jsondata";
const moderationsFolder = jsonDataDir + "/moderations/";

type Moderations = { [target: string]: ModerationData }

export async function saveModeration(guild: Guild, moderation: ModerationData) {
  await ensureDir(moderationsFolder);
  let path = moderationsFolder + guild.id + ".json";
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