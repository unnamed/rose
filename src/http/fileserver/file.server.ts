import path from 'path';
import fs from 'fs';

import {Application, Router} from 'express';
import {HttpModule} from '../http.service';
import {Client} from 'discord.js';

import useUpload from './upload.route';
import useDownload from './download.route';

export function fileServer(client: Client): HttpModule {
  return async (app: Application, moduleConfig: Record<string, any>) => {
    const dataDir = path.join(process.env.ROOT_DIR_PATH, moduleConfig.dataDir);

    // create if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    const router: Router = Router();

    useUpload(router, client, dataDir);
    useDownload(router, dataDir);

    app.use(moduleConfig.route, router);
  };
}
