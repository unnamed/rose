import { Command } from "../command.ts";
import { DiscordenoMessage, ImageScript } from "../../deps.ts";
import config from "../../config.js";

const rubikFont = await Deno.readFile(new URL("../../assets/rubik-variablefont-weight.ttf", import.meta.url));
const ubuntuMonoFont = await Deno.readFile(new URL("../../assets/ubuntu-mono-regular.ttf", import.meta.url));
const baseCanvas = new ImageScript.Image(2000, 1067)
  .composite(
    await ImageScript.Image.decode(await Deno.readFile(new URL("../../assets/quizz-background.png", import.meta.url))),
    0, 0
  );

const rules: any = {
  java: {
    number: 0x9939BFFF,
    word: 0xBE62E3FF,
    string: 0xD08DEB,
    unknown: 0xED82DDFF
  }
};

function isLetter(codePoint: number) {
  if (codePoint === undefined) return false;
  return (64 < codePoint && codePoint < 91) || (96 < codePoint && codePoint < 123);
}

function isNumber(codePoint: number) {
  return 47 < codePoint && codePoint < 58;
}

function isSpace(char: string) {
  return char == ' ' || char == '\t' || char == '\n';
}

function composeJavaCode(code: string): ImageScript.Image {
  let image: ImageScript.Image | undefined;
  let index = 0;
  let x = 0;

  function writeValue(kind: string, value: string) {
    let color = rules.java[kind]; 
    let newImage = ImageScript.Image.renderText(ubuntuMonoFont, 60, value, color);
    if (image === undefined) {
      image = newImage;
      x = image.width;
    } else {
      image = new ImageScript.Image(x + newImage.width, image.height)
        .composite(image)
        .composite(newImage, x);
      x += newImage.width;
    }
  }

  while (index < code.length) {
    let currentCode: any = code.codePointAt(index);
    let current = code.charAt(index);

    if (currentCode === undefined || current === undefined) {
      break;
    }

    if (isNumber(currentCode)) {
      let value = current;
      while (isNumber(currentCode = code.codePointAt(++index) as any)) {
        value += (current = code.charAt(index));
        currentCode = code.codePointAt(index);
      }
      writeValue('number', value);
    } else if (current == '"') {
      let value = '"'; // double quotes aren't ignored
      while ((current = code.charAt(++index)) != '"') {
        value += current;
        if (current == "\\") {
          value += current;
          value += (current = code.charAt(++index));
        }
      }
      value += '"';
      // skip the last double quote
      current = code.charAt(++index);
      currentCode = code.charCodeAt(index);
      writeValue('string', value);
    } else if (isLetter(currentCode)) {
      let value = current;
      while (isLetter(currentCode = code.charCodeAt(++index))) {
        value += (current = code.charAt(index));
      }
      current = code.charAt(index);
      writeValue('word', value);
    } else if (isSpace(current)) {
      let value = " ";
      while (isSpace(current = code.charAt(++index))) {
        currentCode = code.charCodeAt(index);
        value += " ";
        console.log(index);
      }
      currentCode = code.charCodeAt(index);
      x += value.length * 20;
    } else {
      writeValue('unknown', current);
      index++;
    }
  }
  return image as ImageScript.Image;
}

const command: Command = {
  name: "quizz",
  category: "hidden",
  description: "Creates a quizz",
  permissions: {
    use: ["ADMINISTRATOR"]
  },
  arguments: [
    { type: "message" },
    {
      name: "title> | <language> | <code> | <option1> | <option2> | ... | <optionN",
      type: "...str"
    }
  ],
  execute: async (message: DiscordenoMessage, argsFormatted: string) => {
    if (!config.developers.includes(message.authorId.toString())) {
      throw { title: "No permission", description: "Only bot developers can use this command" };
    }

    let args = argsFormatted.split("|");
    let title = args[0].trim();
    let language = args[1].trim();
    let code = args[2].trim();

    const canvas = baseCanvas
      .clone()
      .composite(
        ImageScript.Image.renderText(rubikFont, 80, title, 0xFFFFFFFF),
        200, 130
      )
      .composite(
        composeJavaCode(code),
        220, 270
      );

    
    let blob = new Blob([await canvas.encode()], { type: "image/png" });
    message.channel?.send({
      file: {
        blob,
        name: "quizz.png"
      }
    });
  }
};

export default command;