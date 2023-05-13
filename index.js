import Eueno from '@eueno/lib-node';

import fs from 'fs';
import axios from 'axios';
import * as ethers from 'ethers';
const END_POINT = 'https://v2-developers.eueno.io';

// sharePublicKey =
// '04955a2b53338939076687101a4bbd730ac899fa456d24272386e5233bd5a67f01f539c1039ec4e7e401d6fd1fa0eef7682c1ee6933b3304179f489b3706ae862f';

const projectKeyForDucAccount = '7587cc8d2ed602f274e688f6a27a8ccd5d2228f40e382420ab9954878283dbd0'
class OraichainEueno {
  keyGen = 'z4P7jt5FbLqHzzc3wiJXgE55_9SqFwc4u4uR4sKGWGI';
  mmemomic =
    'bamboo mail february tone update win involve vote thank sting wild meadow';
//   waller = ethers.Wallet.fromPhrase(mmemomic);
  // remove 0x when  run oraichain


  projectKey =
    '3e47ca7f5877e7a86ef1d43c9b6980657c818ba04ea2ff336b63b15167b7ffcc';
  publicKeyOwner ='';
  privateKeyOwner ='';
//   projectId = 296;
  eueno = new Eueno({
    endpoint: END_POINT,
  });
   constructor(data) {
   

   if(data){
    if (data.mmemomic) {
        this.mmemomic = data.mmemomic;
      }
    
      if (data.projectKey) {
        this.projectKey = data.projectKey;
      }
      if (data.publicKeyOwner) {
        this.publicKeyOwner = data.publicKeyOwner;
      }
  
      if (data.keyGen) {
        this.keyGen = data.keyGen;
      }
   }
   const wallet = ethers.Wallet.fromPhrase(this.mmemomic);
   this.privateKeyOwner = wallet.privateKey.slice(2)
   this.generateKey().then(key => this.publicKeyOwner = key)
  }
  generateKey = async () => {
    const key = await this.eueno.createPublicKeyFromPrivateKeyWallet(this.privateKeyOwner)
    return key;
};
  uploadFile = async ({projectId , path , name}) => {
    try {
      const file = fs.readFileSync(path);
      console.log('this.mmemomic',)
        const publicKeyOwner =  await this.generateKey(    )
        console.log('publicKeyOwner',publicKeyOwner)
      const data = await this.eueno.upload(
        file,
        {
          projectKey: this.projectKey,
          key: {
            walletPublicKey: publicKeyOwner,
            fileEncryptionKey: this.keyGen,
          },
        },
        {
          projectId,
          filename: name ,
          contentLength: 22313,
          contentType: 'image/png',
          method: 'ENCRYPT',
          keepPath: false,
        }
      );
      console.log('data', data);
      return data;
    } catch (e) {
      console.log(e);
    }
  };
  // uploadFile();
  getFileTorId = async ({fileId}) => {
    const raw = await this.eueno.getObjectDetail({
      fileId,
      projectKey: this.projectKey,
    });
    console.log('this.privateKeyOwner',this.privateKeyOwner , fileId , raw)
    const data = raw.data;
    const cryptoData = await axios
      .get(data.url, { responseType: 'arraybuffer' })
      .then((response) => response.data);
    const aes = await this.eueno.decryptGetKeyAesWithPriKeyWallet(
      data.encryptKey,
      this.privateKeyOwner
    );
    console.log('aes', aes);

    this.eueno
      .decryptDataByKeyAes(cryptoData, aes.fileEncryptionKey, aes.iv)
      .then((buffer) => {
        // write file
        fs.writeFile('images/' + data.name, Buffer.from(buffer), (err) => {
          if (err) throw err;
          console.log('Image saved!');
        });
      });

    return data;
  };


  getListFileToFolderId = async () => {
    try {
      const data = await this.eueno.getObjectLists({
        projectId,
        projectKey: this.projectKey,
      });
      console.log(`list file`, data);
      return data;
    } catch (error) {
      console.log('alo', error);
    }
  };


  shareFile = async ({ fileId, sharePublicKey ,projectId }) => {
    const data = await this.eueno.shareTo({
      fileId,
      projectKey: this.projectKey,
      projectId,
      walletPrivateKey: this.privateKeyOwner,
      walletPublicKeyShare: sharePublicKey,
    });
    return data;
  };

  getShareFiles = async ({ projectId }) => {
    const data = await this.eueno.getSharedFiles({
      walletPrivateKey: this.projectKey,
      projectId
    });

    return data;
  };

  createFolder = async ({ path, projectId }) => {
    const data = await this.eueno.createFolder({
      projectId,
      path,
      projectKey: this.projectKey,
    });
    return data;
  };
}


//  use include : 
// - privateKey wallet 
// - project key
const projecKeyForNoNameAccount = '2d06bf7855092a2572a7b9a2c274b0574909badbf2bac855059f11edc6f39512'
const mmemomicForNoNameAccount = 'bamboo mail february tone update win involve vote thank sting wild meadow'
const mmemomicForDucAccount = 'hockey repair uncover horror shove limb wink blur into clog visit pottery'
const euenoInstance= new OraichainEueno({
    projectKey : projectKeyForDucAccount ,
    mmemomic :mmemomicForDucAccount
});
// euenoInstance.getFileTorId({fileId : '16815'})
euenoInstance.uploadFile({projectId : 286 , path : 'images/1109d87fcecfc9c86fbd8d1dd4fd35cfchang-trai-liem-dien-thoai-mlem-mlem (1).jpeg' , name : 'chun_test.jpeg'})


