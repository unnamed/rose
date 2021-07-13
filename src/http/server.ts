import express from 'express';
import config from '../config';
import logger from '../log';

let app: express.Application;

export async function getApp(): Promise<express.Application> {
	if (app) {
		return app;
	}

	app = express();
	await app.listen(config.http.port);
	logger.info(`HTTP server running on port ${config.http.port}`);
	return app;
}
