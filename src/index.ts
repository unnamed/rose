import startBot from './bot/bot.service';
import HttpServer from './http/http.service';

import githubWebhook from './http/github/github.webhook';
import fileServer from './http/file.server';

(async function() {
  const client = await startBot();
  const server = new HttpServer();
  if (client !== null) {
    server.install('githubWebhook', githubWebhook(client));
  }
  server.install('temporalFileServer', fileServer);
  await server.start();
})().catch(console.error);