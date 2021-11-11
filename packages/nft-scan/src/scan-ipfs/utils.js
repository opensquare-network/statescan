const axios = require("axios");
const isIPFS = require("is-ipfs");
const sharp = require("sharp");
const { getIpfsMetadataCollection } = require("../mongo");
const { isHex, hexToString } = require("@polkadot/util");

const ipfsGatewayUrl =
  process.env.IPFS_GATEWAY_URL || "https://cloudflare-ipfs.com/ipfs/";

async function createImageThumbnail(image, width, height) {
  const thumbnail = await image
    .resize({
      fit: sharp.fit.outside,
      width,
      height,
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
    .toBuffer();
  return `data:image/png;base64,${thumbnail.toString("base64")}`;
}

async function fetchDataFromIPFS(dataId) {
  if (!dataId) {
    throw new Error(`dataId is missing`);
  }

  if (!isHex(dataId)) {
    return null;
  }

  const maybeCid = hexToString(dataId);
  if (!isIPFS.cid(maybeCid)) {
    return null;
  }

  // fetch data from ipfs
  const maybeJsonData = (await axios.get(`${ipfsGatewayUrl}${maybeCid}`)).data;
  if (
    maybeJsonData?.name &&
    maybeJsonData?.description &&
    maybeJsonData?.image
  ) {
    return {
      cid: maybeCid,
      name: maybeJsonData.name,
      description: maybeJsonData.description,
      image: maybeJsonData.image,
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
            timestamp: new Date(),
          },
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
    url: `${ipfsGatewayUrl}${image}`,
    responseType: "arraybuffer",
  });
  const imageData = ipfsImage.data;
  const sharpImage = sharp(imageData);
  const { format, size, width, height } = await sharpImage.metadata();
  const imageMetadata = { format, size, width, height };

  // create image thumbnail from image data
  const imageThumbnail = await createImageThumbnail(sharpImage, 32, 32);
  await ipfsMetadataCol.updateOne(
    { dataId },
    {
      $set: {
        imageMetadata,
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
