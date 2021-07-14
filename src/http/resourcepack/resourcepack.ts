import fs from 'fs';
import express from 'express';
import {getApp} from '../server';
import config from '../../config';
import {Client, MessageEmbed, TextChannel} from 'discord.js';


const destination = `${__dirname}/data`;
const fileName = 'resource-pack.zip';
const filePath = destination + '/' + fileName;

export async function startResourcePackServer(client: Client) {
	const app: express.Application = await getApp();
	app.post(
		config.http.resourcePack.route,
		(req, res) => {
			if (req.headers['authorization'] !== process.env.RESOURCE_PACK_SECRET) {
				res.status(500).json({
					code: 500,
					error: 'Invalid authorization!'
				});
				return;
			}

			client.channels.fetch('820071190457614357')
				.then(channel => (channel as TextChannel).send(
					new MessageEmbed()
						.setColor(config.color)
						.setTitle('Development Server | Logs')
						.setDescription('Received resource pack update')
						.setTimestamp()
				));
			req.pipe(req['busboy']);
			req['busboy'].on('file', (fieldName, file) => {
				const stream = fs.createWriteStream(filePath);
				file.pipe(stream);
			});

			res.status(200).json({
				status: 'ok',
				url: 'https://artemis.unnamed.team/resource-pack'
			});
		});

	app.get(
		config.http.resourcePack.route,
		(req, res) => {
			res.download(filePath);
		}
	);
}
