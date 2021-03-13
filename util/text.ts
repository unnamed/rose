export function wrapCode(type: string, text: string): string {
  return "```" + type + "\n" + text + "```"; 
}