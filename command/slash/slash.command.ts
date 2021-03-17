import {
  createSlashCommand,
  editSlashResponse,
  executeSlashCommand,

  cache,

  CreateSlashCommandOptions,
  SlashCommandResponseOptions,
  EditSlashResponseOptions,
  InteractionDataOption,
  Member,
  Guild,
  Channel
} from "../../deps.ts";

type InteractionHandler = (interaction: SlashCommandInteraction) => Promise<void>;

export const handlers = new Map<string, InteractionHandler>();

export class SlashCommandInteraction {

  constructor(
    private id: string,
    private token: string,
    public commandId: string,
    public commandName: string,
    public options: InteractionDataOption[],
    private guildId: string,
    private channelId: string,
    public member: Member
  ) {}

  get channel(): Channel {
    let channel = cache.channels.get(this.channelId);
    if (!channel) {
      throw new Error("Channel not found!");
    }
    return channel;
  }

  get guild(): Guild {
    let guild = cache.guilds.get(this.guildId);
    if (!guild) {
      throw new Error("Guild not found!");
    }
    return guild;
  }

  async sendResponse(options: SlashCommandResponseOptions) {
    await executeSlashCommand(this.id, this.token, options);
  }

  async editResponse(options: EditSlashResponseOptions) {
    await editSlashResponse(this.token, options);
  }

}

export function register(
  options: CreateSlashCommandOptions,
  handler: InteractionHandler
) {
  createSlashCommand(options);
  handlers.set(options.name, handler);
}