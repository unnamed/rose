import {HttpModule} from '../../http.service';
import {Application, Router} from 'express';

import useUpload from './temporal.upload.route';
import useDownload from './temporal.get.route';

export function temporalFileServer(): HttpModule {
  return async (app: Application, moduleConfig: NodeJS.Dict<any>) => {
    const router: Router = Router();
    // map where the files are stored
    const files = new Map<string, any>(); // TODO: I don't think we should store files in memory

    useUpload(router, moduleConfig, files);
    useDownload(router, moduleConfig, files);

    app.use(moduleConfig.route, router);
  };
}