import path from 'path';
import fs from 'fs';

import { Application, Router } from 'express';
import { getApp } from '../server';
import config from '../../config';
import { Client } from 'discord.js';

import useUpload from './upload.route';
import useDownload from './download.route';

export async function startResourcePackServer(client: Client) {

  const dataDir = path.join(process.env.ROOT_DIR_PATH, config.http.resourcePack.dataDir);

  // create if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const app: Application = await getApp();
  const router: Router = Router();

  useUpload(router, client, dataDir);
  useDownload(router, dataDir);

  app.use(config.http.resourcePack.route, router);
}
