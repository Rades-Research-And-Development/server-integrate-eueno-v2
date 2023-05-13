import express from 'express';
import { OraichainEueno, euenoInstance } from './euenoFactory.js';
import multer from 'multer';
import path from 'path';
const __dirname = path.resolve();
const router = express.Router();
router.get('/picture', (req, res) => {
  // res.send('hello')
});
// handle uploadImage
router.post('/upload-image', multer().single('file'), async (req, res) => {
  try {
    const { projectId } = req.body;
    const { buffer, mimetype, originalname } = req.file;
    console.log('req.body', req.file, req.body.projectId);

    const data = await euenoInstance.uploadFile({
      projectId,
      contentType: mimetype,
      file: buffer,
      name: originalname,

      // file :
    });
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});
router.post('/get-files', async (req, res) => {
  try {
    console.log('req.body', req);
    const { projectKey, mmemomic, projectId } = req.body;
    const euenoInstance = new OraichainEueno({
      projectKey,
      mmemomic,
    });
    const data = await euenoInstance.getListFileToFolderId({
      projectId: projectId,
    });
    console.log('data', data);
    res.send(data);
  } catch (error) {
    res.send(error);
  }
});
router.get('/get-file/:id', async (req, res) => {
  const { id } = req.params;
  const fileName = await euenoInstance.getFileTorId({
    fileId: id,
  });
  console.log('fileName', fileName);

  const filePath = path.join(__dirname, 'images', fileName);
  console.log('filePath', filePath);
  const options = {
    headers: {
      'Content-Disposition': `attachment; filename=${fileName}`,
    },
  };

  res.sendFile(filePath, options, (err) => {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    } else {
      console.log('Sent:', fileName);
    }
  });
});

export default router;
