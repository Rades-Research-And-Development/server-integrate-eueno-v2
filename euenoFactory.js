import Eueno from '@eueno/lib-node';

import fs from 'fs';
import axios from 'axios';
import * as ethers from 'ethers';
const END_POINT = 'https://v2-developers.eueno.io';

const projectKeyForFirstAccount =
  '7587cc8d2ed602f274e688f6a27a8ccd5d2228f40e382420ab9954878283dbd0';

export class OraichainEueno {
  keyGen = 'z4P7jt5FbLqHzzc3wiJXgE55_9SqFwc4u4uR4sKGWGI';
  mmemomic = '';
  projectKey = '';
  publicKeyOwner = '';
  privateKeyOwner = '';

  eueno = new Eueno({
    endpoint: END_POINT,
  });
  constructor(data) {
    if (data) {
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
    this.privateKeyOwner = wallet.privateKey.slice(2);
    this.generateKey().then((key) => (this.publicKeyOwner = key));
  }
  generateKey = async () => {
    const key = await this.eueno.createPublicKeyFromPrivateKeyWallet(
      this.privateKeyOwner
    );
    return key;
  };
  uploadFile = async ({ projectId, file, name, contentType }) => {
    try {
      const publicKeyOwner = await this.generateKey();

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
          filename: name,
          contentLength: 22313,
          contentType,
          method: 'ENCRYPT',
          keepPath: false,
        }
      );

      return data;
    } catch (e) {
      console.log(e);
    }
  };
  saveFile(name, buffer)  {
    fs.writeFile( name, Buffer.from(buffer), (err) => {
      if (err) throw err;
      console.log('Image saved!');
    });
  }

  getFileTorId = async ({ fileId }) => {
    const raw = await this.eueno.getObjectDetail({
      fileId,
      projectKey: this.projectKey,
    });
    const data = raw.data;
    const cryptoData = await axios
      .get(data.url, { responseType: 'arraybuffer' })
      .then((response) => response.data);
    const aes = await this.eueno.decryptGetKeyAesWithPriKeyWallet(
      data.encryptKey,
      this.privateKeyOwner
    );
    console.log('aes', aes);

    const buffer = await this.eueno.decryptDataByKeyAes(
      cryptoData,
      aes.fileEncryptionKey,
      aes.iv
    );
    this.saveFile('images/' + data.name, buffer )
    return  data.name

  };

  getListFileToFolderId = async ({ projectId }) => {
    try {
      const listFile = await this.eueno.getObjectLists({
        projectId,
        projectKey: this.projectKey,
      });

      return listFile;
    } catch (error) {
      console.log('err', error);
    }
  };

  shareFile = async ({ fileId, sharePublicKey, projectId }) => {
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
      projectId,
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
const projectKeyForSecondAccount =
  '2d06bf7855092a2572a7b9a2c274b0574909badbf2bac855059f11edc6f39512';
const projectKeyForThreeAccount =
  '3e47ca7f5877e7a86ef1d43c9b6980657c818ba04ea2ff336b63b15167b7ffcc';
const mmemomicForNoNameAccount =
  'bamboo mail february tone update win involve vote thank sting wild meadow';
const mmemomicForDucAccount =
  'hockey repair uncover horror shove limb wink blur into clog visit pottery';
export const euenoInstance = new OraichainEueno({
  projectKey: projectKeyForFirstAccount,
  mmemomic: mmemomicForDucAccount,
});


