# Unnamed Bot
Official public Discord Bot of Unnamed Team

## Running
To run the bot, you need to create a `.env` file containing
the bot token and some other properties specified in the `.env.template` file. You can run the `start.sh` script to copy the `.env.template` to a `.env` file, then you need to set its properties.

### Requirements
- [Deno](https://deno.land/): A secure runtime for JavaScript and TypeScript.

### Start
Once you have filled the `.env` file, you can run the `start.sh` script again. It will start the bot using `deno`

## Features
This discord bot contains some util features principally for our [Discord Server](https://discord.gg/xbba2fy), but it's public and open source, so you can invite the bot to your server or modify the code (Read license first)
- **Auto-moderation** The bot can check for spam and flood and automatically applies a sanction, so human moderators aren't required for this
- (TO-DO) **Organization** The bot contains some organization features like task scheduling, annotations and custom per-server commands *(Like Clippy Bot)*

## License
The project is licensed under the MIT license, read [license.txt](license.txt)