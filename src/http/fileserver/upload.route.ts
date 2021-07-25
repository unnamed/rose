import path from 'path';
import {Router} from 'express';
import crypto from 'crypto';
import {Client, MessageEmbed, TextChannel} from 'discord.js';
import config from '../../config';

export default (
  router: Router,
  client: Client,
  dataDir: string,
  moduleConfig: NodeJS.Dict<any>
) => {
  router.post('/upload/:id', (req, res) => {

    const id = req.params.id;

    if (req.headers['authorization'] !== process.env[`APPLICATION_${id}_RESOURCE_PACK_SECRET`]) {
      res.status(500).json({
        code: 500,
        error: 'Invalid authorization!'
      });
      return;
    }

    const file = req['files']['resourcepack'];

    file.mv(path.join(dataDir, id), err => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      const hashSum = crypto.createHash('sha1');
      hashSum.update(file.data);
      const hash = hashSum.digest('hex');
      const downloadUrl = `https://artemis.unnamed.team${moduleConfig.route}/get/${id}`;

      client.channels.fetch('820071190457614357')
        .then(channel => (channel as TextChannel).send(
          new MessageEmbed()
            .setColor(config.color)
            .setAuthor(
              'Artemis Server | Logs',
              (channel as TextChannel).guild.iconURL({size: 64, format: 'png'}),
              downloadUrl
            )
            .setDescription('Received resource pack update')
            .addField('Hash (sha1)', '```' + hash + '```', true)
            .addField('Application', '```' + id + '```', true)
            .addField('User Agent', '```' + req.headers['user-agent'] + '```', true)
            .addField('Download URL', '```' + downloadUrl + '```', true)
            .setTimestamp()
        ));
      res.status(200).json({
        status: 'ok',
        url: downloadUrl,
        hash
      });
    });
  });
};