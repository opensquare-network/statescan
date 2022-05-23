const axios = require("axios");
const isIPFS = require("is-ipfs");
const sharp = require("sharp");
const parseDataURL = require("data-urls");
const { isHex, hexToString } = require("@polkadot/util");
const { getAverageColor } = require("fast-average-color-node");

const ipfsGatewayUrl =
  process.env.IPFS_GATEWAY_URL || "https://cloudflare-ipfs.com/ipfs/";

function isCid(cid) {
  return isIPFS.cid(cid) || isIPFS.base32cid(cid.toLowerCase());
}

async function createImageThumbnail(image, width, height) {
  const thumbnail = await image
    .resize({
      fit: sharp.fit.outside,
      width,
      height,
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
    .toBuffer();

  return thumbnail;
}

async function fetchMetadataFromIpfsByHex(hexData) {
  if (!hexData) {
    throw new Error(`No data provided to fetch metadata from IPFS`);
  }

  if (!isHex(hexData)) {
    return null;
  }

  const maybeCid = hexToString(hexData);
  if (isCid(maybeCid)) {
    const maybeJsonData = (await axios.get(`${ipfsGatewayUrl}${maybeCid}`))
      .data;

    // fetch data from ipfs
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
      but not contain name or image, ignore it`);
    }
  } else {
    try {
      const maybeJsonData = JSON.parse(maybeCid);

      // fetch data from ipfs
      const jsonKeys = Object.keys(maybeJsonData);
      if (jsonKeys.includes("image")) {
        return {
          name: maybeJsonData.name,
          description: maybeJsonData.description, // Optional
          image: maybeJsonData.image,
        };
      } else {
        console.log(`Got on-chain json data: ${JSON.stringify(maybeJsonData)},
        but not contain name or image, ignore it`);
      }
    } catch (e) {
      console.log(`data ${hexData} can not be converted to CID or JSON`);
      return null;
    }
  }

  return null;
}

async function handleImageData(imageData) {
  // todo: we should check the data media type, only handle it if it's image
  const sharpImage = sharp(imageData);
  const { format, size, width, height } = await sharpImage.metadata();

  // create image thumbnail from image data
  const imageThumbnailData = await createImageThumbnail(sharpImage, 32, 32);
  const imageThumbnail = `data:image/png;base64,${imageThumbnailData.toString(
    "base64"
  )}`;

  const { hex: background } = await getAverageColor(imageThumbnailData);
  const imageMetadata = { format, size, width, height, background };

  return {
    imageMetadata,
    imageThumbnail,
  };
}

async function fetchAndSharpImage(imageCid) {
  console.log(`Will fetch image by cid`, imageCid);

  // fetch image from ipfs link item.image
  const ipfsImage = await axios({
    url: `${ipfsGatewayUrl}${imageCid}`,
    responseType: "arraybuffer",
  });
  const imageData = ipfsImage.data;

  return handleImageData(imageData);
}

// sharp image data and get metadata, where the image data is in base64 data URL format
async function sharpDataURL(imageDataURL) {
  const parsedDataUrl = parseDataURL(imageDataURL);
  if (!parsedDataUrl) {
    return {};
  }

  const contentType = parsedDataUrl.mimeType.toString().split(";")[0];
  const imageData = Buffer.from(parsedDataUrl.body);
  if (["image/png", "image/jpeg", "image/jpg"].includes(contentType)) {
    const { imageMetadata, imageThumbnail } = handleImageData(imageData);

    return {
      imageMetadata: {
        ...imageMetadata,
        isDataUrl: true,
      },
      imageThumbnail,
    };
  }

  if (["image/svg", "image/svg+xml"].includes(contentType)) {
    try {
      const svgImage = sharp(imageData);
      const { format, size, width, height } = await svgImage.metadata();
      const imageMetadata = { format, size, width, height, isDataUrl: true };
      const imageThumbnail = imageDataURL;
      return {
        imageMetadata,
        imageThumbnail,
      };
    } catch (e) {
      console.log(e.message);
      return {
        imageMetadata: {
          format: "svg",
          isDataUrl: true,
        },
        imageThumbnail: imageDataURL,
      };
    }
  }

  return {};
}

module.exports = {
  isCid,
  fetchMetadataFromIpfsByHex,
  fetchAndSharpImage,
  sharpDataURL,
};
