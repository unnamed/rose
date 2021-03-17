import LoadingCollection from "../../collection/loading.collection.ts";
import { Embed, Guild, cache, readJson, writeJson, existsSync, ensureDir } from "../../deps.ts";
import { answersDir, getAnswersPath } from "./json.storage.ts";

export const answersCache = new LoadingCollection<[string, string], Embed>(
  async ([guildId, name]) => {
    let guild = cache.guilds.get(guildId);
    if (!guild) {
      return undefined;
    } else {
      return await fetchAnswer(guild, name);
    }
  },
  15000
);

type Answers = { [name: string]: Embed };

/**
 * Searches in the specified guild answers
 * json file for an answer with the specified
 * name
 */
export async function fetchAnswer(
  guild: Guild,
  name: string
): Promise<Embed | undefined> {
  let path = getAnswersPath(guild);
  if (existsSync(path)) {
    let answers = (await readJson(path)) as Answers;
    return answers[name];
  } else {
    return undefined;
  }
}

/**
 * Saves the given answer for the specified
 * guild with the specified name.
 * @returns True if the answer was saved
 */
export async function saveAnswer(
  guild: Guild,
  name: string,
  answer: Embed,
  override = false,
  cache = false
): Promise<boolean> {
  
  await ensureDir(answersDir);
  let path = getAnswersPath(guild);

  // read or create the
  // answers file if absent
  let answers: Answers;

  if (existsSync(path)) {
    answers = (await readJson(path)) as Answers;
    if (answers[name] && !override) {
      return false;
    } else {
      answers[name] = answer;
    }
  } else {
    answers = {};
    answers[name] = answer;
  }

  if (cache) {
    let key: [string, string] = [guild.id, name];
    if (!answersCache.get(key) || override) {
      answersCache.set(key, answer);
    }
  }

  // finally write the data
  await writeJson(path, answers);
  return true;
}