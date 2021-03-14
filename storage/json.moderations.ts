import { ModerationData } from "./types.ts";
import { readJson, writeJson, existsSync } from "../deps.ts";

const jsonDataDir = "./jsondata";
const filename = jsonDataDir + "/moderations.json";

export async function saveModeration(moderation: ModerationData) {
  let moderations: ModerationData[];
  if (existsSync(filename)) {
    moderations = await readJson(filename) as ModerationData[];
  } else {
    moderations = [];
  }
  moderations.push(moderation);
  await writeJson(filename, moderations);
}