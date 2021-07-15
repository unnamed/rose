import crypto from 'crypto';
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

			const file = req['files']['resourcepack'];
			console.log(file);

			file.mv(filePath, err => {
				if (err) {
					res.status(500).send(err);
				} else {
					const hashSum = crypto.createHash('sha1');
					hashSum.update(file.data);
					const hash = hashSum.digest('hex');

					client.channels.fetch('820071190457614357')
						.then(channel => (channel as TextChannel).send(
							new MessageEmbed()
								.setColor(config.color)
								.setAuthor(
									'Development Server | Logs',
									(channel as TextChannel).guild.iconURL({ size: 64, format: 'png'})
								)
								.setDescription('Received resource pack update')
								.addField('Hash (sha1)', hash, true)
								.addField('User Agent', req.headers['user-agent'], true)
								.setTimestamp()
						));
					res.status(200).json({
						status: 'ok',
						url: 'https://artemis.unnamed.team/resource-pack',
						hash
					});
				}
			});
		});

	app.get(
		config.http.resourcePack.route,
		(req, res) => {
			res.download(filePath);
		}
	);
}
