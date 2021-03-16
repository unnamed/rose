import { Embed, Guild, readJson, writeJson, existsSync, ensureDir } from "../../deps.ts";
import { answersDir, getAnswersPath } from "./json.storage.ts";

type Answers = { [name: string]: Embed };

/**
 * Searches in the specified guild answers
 * json file for an answer with the specified
 * name
 */
export async function searchAnswer(
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
  override = false 
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

  // finally write the data
  await writeJson(path, answers);
  return true;
}