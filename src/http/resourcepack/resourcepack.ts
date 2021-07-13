import fs from 'fs';
import express from 'express';
import {getApp} from '../server';
import config from '../../config';


const destination = `${__dirname}/data`;
const fileName = 'resource-pack.zip';
const filePath = destination + '/' + fileName;

export async function startResourcePackServer() {
	const app: express.Application = await getApp();
	app.post(
		config.http.resourcePack.route,
		(req, res) => {
			if (req.headers['x-unnamed-authorization'] !== process.env.RESOURCE_PACK_SECRET) {
				res.status(500).json({
					code: 500,
					error: 'Invalid authorization!'
				});
				return;
			}

			req.pipe(req['busboy']);
			req['busboy'].on('file', (fieldName, file) => {
				const stream = fs.createWriteStream(filePath);
				file.pipe(stream);
			});

			res.status(200).json({ status: 'ok' });
		});

	app.get(
		config.http.resourcePack.route,
		(req, res) => {
			res.download(filePath);
		}
	);
}
