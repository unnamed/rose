import express from 'express';
import multer from 'multer';
import {getApp} from '../server';
import config from '../../config';

const upload = multer({dest: 'resourcepack/'});

export async function startResourcePackServer() {
	const app: express.Application = await getApp();
	app.post(
		config.http.resourcePack.route,
		upload.single('resourcepack'),
		(req, res, next) => {
			if (req.headers['Authorization'] !== process.env.RESOURCE_PACK_SECRET) {
				res.status(500).json({
					code: 500,
					error: 'Invalid authorization!'
				});
				return;
			}

			next();
		});

	app.get(
		config.http.resourcePack.route,
		(req, res) => {
			res.download(`${__dirname}/resourcepack`);
		}
	);
}
