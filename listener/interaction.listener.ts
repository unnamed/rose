import { handlers, SlashCommandInteraction } from "../command/slash/slash.command.ts";
import {
  InteractionCommandPayload,
  InteractionType,
  Member
} from "../deps.ts";

export default {
  event: "interactionCreate",
  execute: (event: Omit<InteractionCommandPayload, "member"> & { member: Member }) => {
    let data = event.data;
    if (!data || event.type !== InteractionType.APPLICATION_COMMAND) {
      return;
    }
    let handle = handlers.get(data.name);
    if (!handle) {
      return;
    }
    handle(new SlashCommandInteraction(
      event.id, event.token, data.id,
      data.name, data.options, event.guild_id,
      event.channel_id, event.member
    ));
  }
}