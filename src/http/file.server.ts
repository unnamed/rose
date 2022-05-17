/*!
 * The file server HTTP module, receives, temporarily
 * saves and serves files
 */
import { HttpModule, HttpModuleConfig } from './http.service';
import { Router } from 'express';
import { formatBytes } from '../util/format';
import crypto from 'crypto';

interface FileServerConfig extends HttpModuleConfig {
  lifetime: number;
  limits: {
    size: number;
  };
}

const fileServer: HttpModule<FileServerConfig> = async (router: Router, config: FileServerConfig) => {
  // map where the files are stored
  const fileMap = new Map<string, any>(); // TODO: I don't think we should store files in memory
  const ipIdMap = new Map<string, string>();

  function idOf(ip: string): string {
    let id = ipIdMap.get(ip);
    if (id === undefined) {
      // generate id, note that ip cannot be
      // obtained from the id
      id = Date.now().toString(36);
      ipIdMap.set(ip, id);
    }
    return id;
  }

  // POST /upload
  // Receives a multipart file request and saves the file with the "file"
  // name, the limit of files per ip is always one, the file size limit is
  // specified by FileServerConfig.limits.size
  //
  // Returns a JSON object containing the download URL, the file ID, and
  // the file SHA-1 hash as a hex string
  router.post(
    '/upload',
    (req, res) => {
      const ip = req.ip;

      function fail(code: number, error: string) {
        res.status(code).json({
          ok: false,
          code,
          error
        });
      }

      const file = req['files']?.['file'];

      if (!file) {
        return fail(400, 'No "file" file specified');
      } else if (file.size > config.limits.size) {
        return fail(413, `File is too large, limit is ${formatBytes(config.limits.size)}`);
      }

      const id = idOf(ip);
      fileMap.set(id, file.data);

      // schedule expiry
      setTimeout(() => {
        fileMap.delete(id);
        ipIdMap.delete(ip);
      }, config.lifetime);

      const hash = crypto.createHash('sha1')
        .update(file.data)
        .digest('hex');

      // finally set the response
      res.status(200).json({
        ok: true,
        status: 'ok',
        url: `https://artemis.unnamed.team${config.route}/get/${id}`,
        id,
        hash
      });
    }
  );

  // GET /get/:id
  // Ask for a previously uploaded file (/upload route)
  router.get(
    '/get/:id',
    (req, res) => {
      const id = req.params.id; // File identifier
      const buffer = fileMap.get(id);

      if (buffer) {
        // it's a single-read resource
        fileMap.delete(id);
        res.status(200).json({
          status: 'ok',
          present: true,
          file: Buffer.from(buffer).toString('base64')
        });
      } else {
        res.status(200).json({
          status: 'ok',
          present: false
        });
      }
    }
  );
};

export default fileServer;