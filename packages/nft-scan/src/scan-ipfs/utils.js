const axios = require("axios");
const isIPFS = require("is-ipfs");

async function updateRecognized(nftCol, nftObj, recognized) {
  await nftCol.updateOne(
    { _id: nftObj._id },
    {
      $set: {
        recognized
      }
    }
  );
}

async function fetchDataFromIPFS(nftObj) {
  if (!nftObj.metadata.data) {
    return null;
  }

  if (!nftObj.metadata.data.startsWith("0x")) {
    return null;
  }

  const dataStr = Buffer.from(nftObj.metadata.data.slice(2), 'hex').toString();

  if (!isIPFS.cid(dataStr)) {
    return null;
  }

  // fetch data from ipfs
  const ipfsData = await axios.get(`https://ipfs.io/ipfs/${dataStr}`);
  const jsonData = ipfsData.data;

  if (jsonData?.name && jsonData?.description && jsonData?.image) {
    return {
      name: jsonData.name,
      description: jsonData.description,
      image: jsonData.image,
    };
  }

  return null;
}

async function scanMeta(nftCol, nftObj) {
  if (!nftObj) {
    return;
  }

  try {
    const nftIPFSData = await fetchDataFromIPFS(nftObj);
    if (!nftIPFSData) {
      await updateRecognized(nftCol, nftObj, false);
      return;
    }

    await nftCol.updateOne(
      { _id: nftObj._id },
      {
        $set: {
          info: nftIPFSData,
          recognized: true,
        }
      }
    );

  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  scanMeta,
};
