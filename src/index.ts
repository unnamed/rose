import startBot from './bot/bot.service';
import HttpServer from './http/http.service';

import githubWebhook from './http/github/github.webhook';
import fileServer from './http/file.server';

(async function() {
  const client = await startBot();
  await new HttpServer()
    .install('githubWebhook', githubWebhook(client))
    .install('temporalFileServer', fileServer)
    .start();
})().catch(console.error);

