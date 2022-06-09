const axios = require("axios");
const sharp = require("sharp");
const parseDataURL = require("data-urls");
const { isHex, hexToString } = require("@polkadot/util");
const { extractCid } = require("./common/extractCid");
const { isCid } = require("./common/isCid");
const { getAverageColor } = require("fast-average-color-node");

const ipfsGatewayUrl = process.env.IPFS_GATEWAY_URL || "https://ipfs.io/ipfs/";

async function createImageThumbnail(image, width, height) {
  return image
    .resize({
      fit: sharp.fit.outside,
      width,
      height,
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
    .toBuffer();
}

async function fetchIpfsMetadata(cid) {
  const maybeJsonData = (await axios.get(`${ipfsGatewayUrl}${cid}`)).data;

  // fetch data from ipfs
  const jsonKeys = Object.keys(maybeJsonData);
  if (jsonKeys.includes("name") && jsonKeys.includes("image")) {
    return {
      cid,
      name: maybeJsonData.name,
      description: maybeJsonData.description, // Optional
      image: maybeJsonData.image,
    };
  } else {
    console.log(`Got IPFS response by cid: ${cid} from data: ${hexData},
    but not contain name or image, ignore it`);
  }
}

async function handleJsonMetadata(json = {}) {
  const normalizedJson = Object.entries(json).reduce((result, [key, value]) => {
    const lowercaseKey = (key || "").toLowerCase();
    result[lowercaseKey] = value;

    return result;
  }, {});

  if (normalizedJson["image"]) {
    return {
      name: json.name,
      description: json.description, // Optional
      image: json.image,
    };
  } else {
    console.log(`Got on-chain json data: ${JSON.stringify(json)},
    but not contain image, ignore it`);
  }
}

async function parseRawOnchainMetadata(hexData) {
  if (!hexData) {
    throw new Error(`No data provided`);
  }

  if (!isHex(hexData)) {
    throw new Error(`Not hex metadata`);
  }

  const dataText = hexToString(hexData);
  const maybeCid = extractCid(dataText);
  if (isCid(maybeCid)) {
    return await fetchIpfsMetadata(maybeCid);
  }

  try {
    const jsonData = JSON.parse(dataText);
    return await handleJsonMetadata(jsonData);
  } catch (e) {
    console.log(`data ${hexData} can not be converted to CID or JSON`);
    return null;
  }
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
  parseRawOnchainMetadata,
  fetchAndSharpImage,
  sharpDataURL,
};
