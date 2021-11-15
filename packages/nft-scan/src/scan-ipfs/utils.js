const axios = require("axios");
const isIPFS = require("is-ipfs");
const sharp = require("sharp");
const { getNftMetadataCollection } = require("../mongo");
const { isHex, hexToString } = require("@polkadot/util");
const { getAverageColor } = require("fast-average-color-node");

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

async function fetchDataFromIPFS(data) {
  if (!data) {
    throw new Error(`data is missing`);
  }

  if (!isHex(data)) {
    return null;
  }

  const maybeCid = hexToString(data);
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

async function scanMeta(dataHash, data) {
  if (!data) {
    return;
  }

  console.log(`Scanning ipfs meta data for`, dataHash);

  const nftMetadataCol = await getNftMetadataCollection();

  try {
    const nftIPFSData = await fetchDataFromIPFS(data);
    if (nftIPFSData) {
      await nftMetadataCol.updateOne(
        { dataHash },
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
      await nftMetadataCol.updateOne(
        { dataHash },
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

async function scanMetaImage(dataHash) {
  if (!dataHash) {
    return;
  }

  console.log(`Scanning ipfs meta image for`, dataHash);

  const nftMetadataCol = await getNftMetadataCollection();
  const item = await nftMetadataCol.findOne({ dataHash });
  if (!item) {
    return;
  }

  if (!item.recognized) {
    return;
  }

  if (!item.image) {
    return;
  }

  if (!item.image.startsWith("ipfs://")) {
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
  const background = await getAverageColor(imageData);
  const imageMetadata = { format, size, width, height, background };

  // create image thumbnail from image data
  const imageThumbnail = await createImageThumbnail(sharpImage, 32, 32);
  await nftMetadataCol.updateOne(
    { dataHash },
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
