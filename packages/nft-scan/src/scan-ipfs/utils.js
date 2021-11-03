const axios = require("axios");
const isIPFS = require("is-ipfs");
const { getIpfsMetadataCollection } = require("../mongo");

async function fetchDataFromIPFS(dataId) {
  if (!dataId) {
    throw new Error(`dataId is missing`);
  }

  if (!dataId.startsWith("0x")) {
    return null;
  }

  const dataStr = Buffer.from(dataId.slice(2), 'hex').toString();

  if (!isIPFS.cid(dataStr)) {
    return null;
  }

  // fetch data from ipfs
  const ipfsData = await axios.get(`https://ipfs.io/ipfs/${dataStr}`);
  const jsonData = ipfsData.data;

  if (jsonData?.name && jsonData?.description && jsonData?.image) {
    return {
      cid: dataStr,
      name: jsonData.name,
      description: jsonData.description,
      image: jsonData.image,
    };
  }

  return null;
}

async function scanMeta(dataId) {
  if (!dataId) {
    return;
  }

  console.log(`Scanning ipfs meta data for`, dataId);

  const ipfsMetadataCol = await getIpfsMetadataCollection();

  try {
    const nftIPFSData = await fetchDataFromIPFS(dataId);
    if (nftIPFSData) {
      await ipfsMetadataCol.updateOne(
        { dataId },
        {
          $set: {
            ...nftIPFSData,
            recognized: true,
            timestamp: new Date()
          }
        },
        { upsert: true }
      );
    } else {
      await ipfsMetadataCol.updateOne(
        { dataId },
        {
          $set: {
            recognized: false,
            timestamp: new Date(),
          },
        },
        { upsert: true }
      );
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  scanMeta,
};
