import path from 'path';

import startBot from './bot/bot.service';
import {HttpServer} from './http/http.service';

import {fileServer} from './http/fileserver/file.server';
import {githubWebhook} from './http/github/github.webhook';

// load environment variables
require('dotenv').config();
process.env.ROOT_DIR_PATH = path.join(__dirname, '..');

const client = startBot();

new HttpServer()
  .install('fileServer', fileServer(client))
  .install('githubWebhook', githubWebhook(client))
  .start()
  .catch(console.error);
