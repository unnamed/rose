import {Router} from 'express';
import path from 'path';

export default (
  router: Router,
  dataDir: string
) => {
  router.get('/get/:id', (req, res) => {
    res.download(path.join(dataDir, req.params.id));
  });
};