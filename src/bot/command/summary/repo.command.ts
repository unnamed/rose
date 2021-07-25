import {Command} from '../command';

import fetch from 'node-fetch';

const baseUrl = 'https://repo.unnamed.team/service/rest/v1';

const command: Command = {
  name: 'repo',
  category: 'team',
  description: 'Check the status of our repository',
  arguments: [],
  async execute() {

    let repositories;
    let ping;

    try {
      const start = Date.now();
      const response = await fetch(`${baseUrl}/repositories`, {method: 'GET'});
      const end = Date.now();

      repositories = await response.json();
      ping = end - start;
    } catch (err) {
      console.error(err);
      throw {
        title: 'Maven Repositories Status',
        description: 'Something failed, the repository is probably not online'
      };
    }

    const fields = [];

    for (const repository of repositories) {
      fields.push(
        {
          name: repository.name,
          value: `> Format: \`${repository.format}\``
            + `\n> Type: \`${repository.type}\``,
          inline: true
        }
      );
    }

    throw {
      title: 'Maven Repositories Status',
      description: `Nexus is online, response time: \`${ping / 1000}\`s.`,
      fields
    };
  }
};

export default command;