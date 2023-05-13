import express from 'express';
import { OraichainEueno, euenoInstance } from './euenoFactory.js';
import multer from 'multer';
import path from 'path';
const __dirname = path.resolve();
const router = express.Router();
// handle uploadImage
router.post('/upload-image', multer().single('file'), async (req, res) => {
  try {
    const { projectId } = req.body;
    const { buffer, mimetype, originalname } = req.file;


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
// get list file in folder by folder Id
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

    res.send(data);
  } catch (error) {
    res.send(error);
  }
});

router.post('/share-file', async (req, res) => {
    const {fileId , sharePublicKey , projectId } = req.body;
    const dataReq = await euenoInstance.shareFile(req.body);
    return res.send(dataReq)
});

// get list share file
router.get('/get-share-files', async (req, res) => {
    const { projectId } = req.body;
    const dataReq = await euenoInstance.getShareFiles(req.body);
    res.send(dataReq)
})



// get detail file by ID
router.get('/get-file/:id', async (req, res) => {
  const { id } = req.params;
  const fileName = await euenoInstance.getFileTorId({
    fileId: id,
  });

  const filePath = path.join(__dirname, 'images', fileName);

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
