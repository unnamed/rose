import {Client} from 'discord.js';
import http from 'http';
import bl from 'bl';
import crypto from 'crypto';

import config from '../../config.js';
import logger from '../../log';
import {handleData} from './github.packet.receiver';


const webhookConfig = config.webhooks.github;

// based on rvagg's github webhook handler: https://github.com/rvagg/github-webhook-handler
export function start(client: Client) {
	const server = http.createServer((req, res) => {

		function fail(message?) {
			if (message) {
				res.statusCode = 400;
				res.end(message);
			} else {
				res.statusCode = 404;
				res.end('Not Found');
			}
		}

		if (req.url !== webhookConfig.path || req.method !== 'POST') {
			fail();
			return;
		}

		const signature: string = req.headers['x-hub-signature'] as string;
		const event: string = req.headers['x-github-event'] as string;

		if (!signature || !event || !req.headers['x-github-delivery']) {
			fail('signature, event and delivery are required headers!');
			return;
		}

		req.pipe(bl((err, data) => {

			if (err) {
				fail(err.message);
				return;
			}

			const sig = Buffer.from(signature);
			const signed = Buffer.from(
				`sha1=${crypto.createHmac('sha1', webhookConfig.secret)
					.update(data)
					.digest('hex')}`
			);

			if (sig.length !== signed.length || !crypto.timingSafeEqual(sig, signed)) {
				fail('x-hub-signature doesn\'t match with data signature');
				return;
			}

			try {
				const dataJson = JSON.parse(data.toString());
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end('{"ok": true}');
				handleData(client, event, dataJson);
			} catch (e) {
				fail(e.message);
			}
		}));
	});

	server.listen(webhookConfig.port);
	logger.info(`GitHub WebHook HTTP server running on port ${webhookConfig.port}`);
}
