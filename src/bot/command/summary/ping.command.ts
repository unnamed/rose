import CommandBuilder from '../command.builder';

export default new CommandBuilder()
  .setName('ping')
  .setDescription('Check the bot internet connection')
  .setExecutor(async interaction => {
    const ping = (Date.now() - interaction.createdTimestamp) / 1000;
    throw {
      title: 'Pong!',
      description: `The bot ping is \`${ping}\` seconds`
    };
  })
  .build();