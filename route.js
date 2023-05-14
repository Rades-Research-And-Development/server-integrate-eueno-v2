import express from 'express';
import { OraichainEueno, euenoInstance } from './euenoFactory.js';
import multer from 'multer';
import path from 'path';
import axios from 'axios';

const __dirname = path.resolve();
const router = express.Router();
// handle uploadImage
router.get('/', (req, res) => {
  res.send('Welcome to API Rades');
});

router.post('/upload-image', multer().single('file'), async (req, res) => {
  try {
    const { projectId } = req.body;
    const { buffer, mimetype, originalname } = req.file;

    const data = await euenoInstance.uploadFile({
      projectId,
      contentType: mimetype,
      file: buffer,
      name: originalname,
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

    res.send(datare - fia);
  } catch (error) {
    res.send(error);
  }
});

router.post('/share-file', async (req, res) => {
  const { fileId, sharePublicKey, projectId } = req.body;
  const dataReq = await euenoInstance.shareFile(req.body);
  return res.send(dataReq);
});

// get list share file
router.get('/get-shles', async (req, res) => {
  const { projectId } = req.body;
  const dataReq = await euenoInstance.getShareFiles(req.body);
  res.send(dataReq);
});

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
router.post('/airight', multer().single('file'), async (req, res) => {
  const file = req.file;
  console.log('file', file);
  const fileBlobTest = new Blob([file.buffer], { type: file.mimetype });
  const API_KEY_AIRIGHT =
    'esyYxzf5w9cUUsXnvLfnESc5rZ43JG6aTys24RdVctx2cYQUC2ZdXGUdkr9KBvX1';
  console.log('file', file);
  const AIRIGHT_ENDPOINT =
    'https://staging-api-aioracle.airight.io/api-key/report/';
  const formData = new FormData();
  formData.append('image', fileBlobTest);
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'api-key': API_KEY_AIRIGHT,
      'Access-Control-Allow-Origin': '*',
    },
  };
  //   console.log('formData', formData);
  const response = await axios.post(AIRIGHT_ENDPOINT, formData, config);
  console.log(response.data);

  req.send(response.data);
});

export default router;
