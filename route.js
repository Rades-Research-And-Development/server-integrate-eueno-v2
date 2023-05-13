const express = require('express')
const router = express.Router()
router.get('/picture' ,     (req, res) => {
    
})  
// handle uploadImage 
router.post('/uploadImage', async (req, res) => {
    try {
        const file = req.files.file

        const fileName = file.name

        const fileSize = file.size        // get type file
        const fileType = file.mimetype
        const data = await eueno.upload(
            file,
            {
              projectKey,
              key: {
                walletPublicKey: publicKeyOwner,
                fileEncryptionKey: keyGen,
              },
            },
            {
              projectId,
              filename: fileName,
              contentLength: fileSize,
              contentType: fileType,
              method: 'ENCRYPT',
              keepPath: false,
            }
          );
          console.log('data', data);
    res.send(data)
    } catch (error) {
        console.log(error)
    }
})
