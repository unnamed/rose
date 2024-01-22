import {Client, TextChannel} from "discord.js";

interface Task {
  submittedBy: {
    id: string;
    name: string;
    spigotId: string;
  };
  description: string;
}


export async function submit(client: Client, task: Task): Promise<void> {
  const channel = await client.channels.fetch('1198877326595862578') as TextChannel;
  await channel.send(`'${task.description}' submitted by <@${task.submittedBy.id}> (${task.submittedBy.name}, Spigot ID: ${task.submittedBy.spigotId})`);
}