import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import config from '../../config';
import logger from '../log';

export type HttpModule<T extends HttpModuleConfig> = (
  router: express.Router,
  config: T
) => Promise<void>;

export interface HttpModuleConfig {
  enabled: boolean;
  route: string;
}

export default class HttpServer {

  private modules = new Map<string, HttpModule<any>>();

  install(name: string, module: HttpModule<any>): HttpServer {
    this.modules.set(name, module);
    return this; // for a fluent api
  }

  async start() {
    const enabledModules = new Map<string, HttpModule<any>>();
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
      const router = express.Router();
      await enable(router, moduleConfig);
      app.use(moduleConfig.route, router);
    }

    await app.listen(config.http.port);
    logger.info(`HTTP server listening on port ${config.http.port}`);
  }

}
