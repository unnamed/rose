import { Client } from 'discord.js';
import bl from 'bl';
import crypto from 'crypto';
import { Router } from 'express';

import { handleData } from './github.packet.receiver';
import { HttpModule, HttpModuleConfig } from '../http.service';
import WritableStream = NodeJS.WritableStream;

interface GitHubWebhookConfig extends HttpModuleConfig {
  secret: string;
}

// based on rvagg's github webhook handler: https://github.com/rvagg/github-webhook-handler
export default function githubWebhook(client: Client): HttpModule<GitHubWebhookConfig> {
  return async (router: Router, config: GitHubWebhookConfig) => {
    router.post('/', (req, res) => {

      function fail(message?) {
        if (message) {
          res.status(400).end(message);
        } else {
          res.status(400).end('Not Found');
        }
      }

      const signature: string = req.headers['x-hub-signature'] as string;
      const event: string = req.headers['x-github-event'] as string;

      if (!signature || !event || !req.headers['x-github-delivery']) {
        return fail('signature, event and delivery are required headers!');
      }

      req.pipe(bl((err, data) => {
        if (err) {
          return fail(err.message);
        }

        const sig = Buffer.from(signature);
        const signed = Buffer.from(
          `sha1=${crypto.createHmac('sha1', config.secret)
            .update(data)
            .digest('hex')}`
        );

        if (sig.length !== signed.length || !crypto.timingSafeEqual(sig, signed)) {
          return fail('x-hub-signature doesn\'t match with data signature');
        }

        try {
          const dataJson = JSON.parse(data.toString());
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end('{"ok": true}');
          handleData(client, event, dataJson);
        } catch (e) {
          fail(e.message);
        }
      }) as unknown as WritableStream);
    });
  };
}
