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
}