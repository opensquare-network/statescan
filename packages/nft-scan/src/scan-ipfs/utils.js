const axios = require("axios");
const isIPFS = require("is-ipfs");
const sharp = require("sharp");
const { getIpfsMetadataCollection } = require("../mongo");

async function createImageThumbnail(imageData, width, height) {
  const thumbnail = await sharp(imageData)
    .resize(width, height)
    .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
    .toBuffer();
  const thumbnailDataURL = `data:image/png;base64,${thumbnail.toString("base64")}`;
  return thumbnailDataURL;
}

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

      await scanMetaImage(dataId);
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

async function scanMetaImage(dataId) {
  if (!dataId) {
    return;
  }

  console.log(`Scanning ipfs meta image for`, dataId);

  const ipfsMetadataCol = await getIpfsMetadataCollection();
  const item = await ipfsMetadataCol.findOne({ dataId });
  if (!item) {
    return;
  }

  if (!item.recognized) {
    return;
  }

  if (!item.image) {
    return;
  }

  const image = item.image.split("/").pop();
  if (!image) {
    return;
  }

  if (!isIPFS.cid(image)) {
    return;
  }

  console.log(`Fetch image:`, image);

  // fetch image from ipfs link item.image
  const ipfsImage = await axios({
    url: `https://ipfs.io/ipfs/${image}`,
    responseType: "arraybuffer"
  });
  const imageData = ipfsImage.data;

  // create image thumbnail from image data
  const imageThumbnail = await createImageThumbnail(imageData, 32, 32);
  await ipfsMetadataCol.updateOne(
    { dataId },
    {
      $set: {
        imageThumbnail,
      },
    },
    { upsert: true }
  );
}

module.exports = {
  scanMeta,
  scanMetaImage,
};
