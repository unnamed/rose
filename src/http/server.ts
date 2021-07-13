import express from 'express';
import config from '../config';
import logger from '../log';
import busboy from 'connect-busboy';

let app: express.Application;

export async function getApp(): Promise<express.Application> {
	if (app) {
		return app;
	} else {
		app = express();
		app.use(busboy());
		return app;
	}
}

export async function startIfCreated() {
	if (app) {
		await app.listen(config.http.port);
		logger.info(`HTTP server running on port ${config.http.port}`);
	}
}
