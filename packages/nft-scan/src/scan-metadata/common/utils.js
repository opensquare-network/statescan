const axios = require("axios");
const sharp = require("sharp");
const parseDataURL = require("data-urls");
const { isHex, hexToString } = require("@polkadot/util");
const { extractCid } = require("./extractCid");
const { isCid } = require("./isCid");
const { getAverageColor } = require("fast-average-color-node");

const ipfsGatewayUrls = (
  process.env.IPFS_GATEWAY_URLS || "https://ipfs.io/ipfs/"
).split(";");

async function ipfsFetchJson(cid) {
  return await Promise.any(
    ipfsGatewayUrls.map(
      async (ipfsGatewayUrl) =>
        (
          await axios.get(`${ipfsGatewayUrl}${cid}`)
        ).data
    )
  );
}

async function ipfsFetchImage(imageCid) {
  return await Promise.any(
    ipfsGatewayUrls.map(
      async (ipfsGatewayUrl) =>
        (
          await axios({
            url: `${ipfsGatewayUrl}${imageCid}`,
            responseType: "arraybuffer",
          })
        ).data
    )
  );
}

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
  const maybeJsonData = await ipfsFetchJson(cid);

  // fetch data from ipfs
  let jsonKeys;
  try {
    jsonKeys = Object.keys(maybeJsonData);
  } catch (e) {
    // When maybeJsonData is not JSON
    // RangeError: Too many properties to enumerate
    console.log(e.toString());
    console.log(
      `Got IPFS response by cid: ${cid}, but it is not JSON, ignore it`
    );
    return null;
  }

  if (jsonKeys.includes("name") && jsonKeys.includes("image")) {
    return {
      cid,
      name: maybeJsonData.name,
      description: maybeJsonData.description, // Optional
      image: maybeJsonData.image,
    };
  } else {
    console.log(`Got IPFS response by cid: ${cid},
    but not contain name or image, ignore it`);
    return null;
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
    return null;
  }
}

async function parseRawOnchainMetadata(hexData) {
  if (!hexData) {
    return null;
  }

  if (!isHex(hexData)) {
    return null;
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
  const imageData = await ipfsFetchImage(imageCid);
  console.log(`Image fetch succeed. cid: ${imageCid}`);
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
