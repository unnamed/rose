import express from 'express';
import fileUpload from 'express-fileupload';
import config from '../config';
import logger from '../log';

let app: express.Application;

export async function getApp(): Promise<express.Application> {
	if (app) {
		return app;
	} else {
		app = express();
		app.use(fileUpload());
		return app;
	}
}

export async function startIfCreated() {
	if (app) {
		await app.listen(config.http.port);
		logger.info(`HTTP server running on port ${config.http.port}`);
	}
}
