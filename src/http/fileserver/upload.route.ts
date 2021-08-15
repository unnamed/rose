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

    // application id
    const id = req.params.id;

    // function to set status code and error
    function fail(code: number, error: string) {
      res.status(code).json({
        ok: false,
        code,
        error
      });
    }

    // check if has a valid authorization token
    if (req.headers['authorization'] !== process.env[`APPLICATION_${id}_RESOURCE_PACK_SECRET`]) {
      return fail(401, 'Invalid authorization token');
    }

    // look for uploaded files
    const files = req['files'];

    if (!files) {
      return fail(400, 'No files specified');
    }

    // TODO: Not only accept 'resourcepack' file
    const file = files['resourcepack'];

    if (!file) {
      return fail(400, 'No "resourcepack" file specified');
    }

    file.mv(path.join(dataDir, id), err => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      // compute file hash
      const hashSum = crypto.createHash('sha1');
      hashSum.update(file.data);
      const hash = hashSum.digest('hex');
      const downloadUrl = `https://artemis.unnamed.team${moduleConfig.route}/get/${id}`;

      // notify about the upload
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
            .addField('Size', '```' + file.size + '```', true)
            .addField('Application', '```' + id + '```', true)
            .addField('User Agent', '```' + req.headers['user-agent'] + '```', true)
            .addField('Download URL', '```' + downloadUrl + '```', true)
            .setTimestamp()
        ));

      // finally set the response
      res.status(200).json({
        status: 'ok',
        url: downloadUrl,
        hash
      });
    });
  });
};