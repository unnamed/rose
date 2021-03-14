import { EventHandlers, walkSync } from "../deps.ts";

export default async function loadListeners(): Promise<EventHandlers> {
  let handlers: any = {};
  for (let entry of walkSync("./listener")) {
    if (entry.path.endsWith("ts")) {
      let listener = (await import("../" + entry.path)).default;
      handlers[listener.event] = listener.execute;
    }
  }
  return handlers as EventHandlers;
}