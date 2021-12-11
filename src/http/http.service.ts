import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import config from '../../config';
import logger from '../log';

export type HttpModule = (
  app: express.Application,
  config: NodeJS.Dict<any>
) => Promise<void>;

export class HttpServer {

  private modules = new Map<string, HttpModule>();

  install(name: string, module: HttpModule): HttpServer {
    this.modules.set(name, module);
    return this; // for a fluent api
  }

  async start() {
    const enabledModules = new Map<string, HttpModule>();
    this.modules.forEach((module, name) => {
      if (config.http.modules[name].enabled) {
        enabledModules.set(name, module);
      }
    });

    if (!enabledModules) {
      logger.info('No HTTP modules enabled, HTTP server won\'t start');
      return;
    }

    const app = express();

    if (config.http.trustProxy) {
      app.set('trust proxy', 1);
    }

    app.use(fileUpload({
      // 5mb file size limit
      limits: { fileSize: 5e+6 }
    }));
    app.use(cors());

    logger.info(`Starting HTTP server with ${enabledModules.size} modules`);

    for (const name of enabledModules.keys()) {
      logger.info(`\tEnabling '${name}' module`);
      const enable = enabledModules.get(name);
      const moduleConfig = config.http.modules[name];
      await enable(app, moduleConfig);
    }

    await app.listen(config.http.port);
    logger.info(`HTTP server listening on port ${config.http.port}`);
  }

}
