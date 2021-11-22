import path from 'path';

import startBot from './bot/bot.service';
import {HttpServer} from './http/http.service';

import {githubWebhook} from './http/github/github.webhook';
import {temporalFileServer} from './http/fileserver/temporal/temporal.file.server';

// load environment variables
require('dotenv').config();
process.env.ROOT_DIR_PATH = path.join(__dirname, '..');

(async function() {
  const client = await startBot();
  await new HttpServer()
    .install('githubWebhook', githubWebhook(client))
    .install('temporalFileServer', temporalFileServer())
    .start();
})().catch(console.error);

