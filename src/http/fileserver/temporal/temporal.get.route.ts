import {Router} from 'express';

export default (
  router: Router,
  moduleConfig: NodeJS.Dict<any>,
  fileMap: Map<string, any>
) => {
  router.get(
    '/get/:id',
    (req, res) => {
      // File identifier
      const id = req.params.id;

      const buffer = fileMap.get(id);
      let deleted = false;

      if (buffer) {
        // it's a single-read resource
        deleted = fileMap.delete(id);
      }

      res.status(200).json({
        status: 'ok',
        file: Buffer.from(buffer).toString('base64'),
        deleted
      });
    }
  );
}