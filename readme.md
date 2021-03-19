# Unnamed Bot
Official public Discord Bot of Unnamed Team

## Running
To run the bot, a `.env` file is necessary, containing
the bot token and some other properties.

To automate this process, there's a `.env.variables` file and the `start` script that checks for
`.env` presence. If the `.env` file doesn't exist, it will ask you for the variable values.

### Requirements
- [Deno](https://deno.land/): A secure runtime for JavaScript and TypeScript.

## Features
This discord bot contains some util features principally for our [Discord Server](https://discord.gg/xbba2fy), but it's public and open source, so you can invite the bot to your server or modify the code (Read license first)
- **Auto-moderation** The bot can check for spam and flood and automatically applies a sanction, so human moderators aren't required for this
- (TO-DO) **Organization** The bot contains some organization features like task scheduling, annotations and custom per-server commands *(Like Clippy Bot)*

## License
The project is licensed under the MIT license, read [license.txt](license.txt)