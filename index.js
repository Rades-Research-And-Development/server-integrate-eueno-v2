import Eueno from '@eueno/lib-node';
// const  ASC = require('@eueno/lib-node/src/aes');
import fs from 'fs';
import axios from 'axios';
import * as ethers from 'ethers';
const eueno = new Eueno({
  endpoint: 'https://v2-developers.eueno.io',
});

const keyGen = 'z4P7jt5FbLqHzzc3wiJXgE55_9SqFwc4u4uR4sKGWGI';
const mmemomic =
  'bamboo mail february tone update win involve vote thank sting wild meadow';
const waller = ethers.Wallet.fromPhrase(mmemomic);
// remove 0x when  run oraichain
const privateKeyOwner =
  '6edec7c4441606e0c2feddd3f8930c4b99b980c52ee85566e04d1c1c3acd8b5f';

const projectKey =
  '3e47ca7f5877e7a86ef1d43c9b6980657c818ba04ea2ff336b63b15167b7ffcc';
const publicKeyOwner =
  '04955a2b53338939076687101a4bbd730ac899fa456d24272386e5233bd5a67f01f539c1039ec4e7e401d6fd1fa0eef7682c1ee6933b3304179f489b3706ae862f';
const projectId = 296;
export const uploadFile = async () => {
  try {
    const file = fs.readFileSync('1.png');

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
        filename: '1.png',
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
export const getFileTorId = async (fileId) => {
  const raw = await eueno.getObjectDetail({
    fileId,
    projectKey,
  });
  const data = raw.data;
  const cryptoData = await axios
    .get(data.url, { responseType: 'arraybuffer' })
    .then((response) => response.data);
  const aes = await eueno.decryptGetKeyAesWithPriKeyWallet(
    data.encryptKey,
    privateKeyOwner
  );

  eueno
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
// getFileTorId(16941);

export const getListFileToFolderId = async () => {
  try {
    const data = await eueno.getObjectLists({
      projectId,
      projectKey,
    });
    console.log(`list file`, data);
    return data;
  } catch (error) {
    console.log('alo', error);
  }
};

const sharePublicKey =
  '04955a2b53338939076687101a4bbd730ac899fa456d24272386e5233bd5a67f01f539c1039ec4e7e401d6fd1fa0eef7682c1ee6933b3304179f489b3706ae862f';

export const shareFile = async ({ fileId }) => {
  const data = await eueno.shareTo({
    fileId,
    projectKey,
    projectId,
    walletPrivateKey: privateKeyOwner,
    walletPublicKeyShare: sharePublicKey,
  });
  return data;
};

shareFile({ fileId: 16941 });

export const getShareFiles = async ({ folderId }) => {
  const data = await eueno.getSharedFiles({
    walletPrivateKey: projectKey,
    projectId: folderId,
  });

  return data;
};

export const createFolder = async ({ namePath }) => {
  const data = await eueno.createFolder({
    projectId,
    path: namePath,
    projectKey,
  });
  return data;
};
