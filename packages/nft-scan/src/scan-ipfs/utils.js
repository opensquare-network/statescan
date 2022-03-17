const axios = require("axios");
const sharp = require("sharp");
const { extractCid } = require("./common/extractCid");
const { isCid } = require("./common/isCid");
const { getAverageColor } = require("fast-average-color-node");

const ipfsGatewayUrl = process.env.IPFS_GATEWAY_URL || "https://ipfs.io/ipfs/";

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

async function fetchMetadataFromIpfsByHex(hexData) {
  const maybeCid = extractCid(hexData);
  if (!isCid(maybeCid)) {
    console.log(`data ${hexData} can not be converted to CID`);
    return null;
  }

  // fetch data from ipfs
  const maybeJsonData = (await axios.get(`${ipfsGatewayUrl}${maybeCid}`)).data;
  const jsonKeys = Object.keys(maybeJsonData);
  if (jsonKeys.includes("name") && jsonKeys.includes("image")) {
    return {
      cid: maybeCid,
      name: maybeJsonData.name,
      description: maybeJsonData.description, // Optional
      image: maybeJsonData.image,
    };
  } else {
    console.log(`Got IPFS response by cid: ${maybeCid} from data: ${hexData},
    but not contain name, description or image, ignore it`);
  }

  return null;
}

async function fetchAndSharpImage(imageCid) {
  console.log(`Will fetch image by cid`, imageCid);

  // fetch image from ipfs link item.image
  const ipfsImage = await axios({
    url: `${ipfsGatewayUrl}${imageCid}`,
    responseType: "arraybuffer",
  });
  const imageData = ipfsImage.data;

  // todo: we should check the data media type, only handle it if it's image
  const sharpImage = sharp(imageData);
  const { format, size, width, height } = await sharpImage.metadata();
  const { hex: background } = await getAverageColor(imageData);
  const imageMetadata = { format, size, width, height, background };

  // create image thumbnail from image data
  const imageThumbnail = await createImageThumbnail(sharpImage, 32, 32);

  return {
    imageMetadata,
    imageThumbnail,
  };
}

module.exports = {
  fetchMetadataFromIpfsByHex,
  fetchAndSharpImage,
};
