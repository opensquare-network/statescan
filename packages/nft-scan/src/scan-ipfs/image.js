const { extractCid } = require("./common/extractCid");
const { isCid } = require("./common/isCid");
const { getNftMetadataCollection } = require("../mongo");
const { fetchAndSharpImage, sharpDataURL } = require("./utils");
const parseDataURL = require("data-urls");

async function setImageError(imageUrl) {
  const nftMetadataCol = await getNftMetadataCollection();
  await nftMetadataCol.updateMany(
    { image: imageUrl },
    {
      $set: {
        error: "imageError",
      },
    }
  );
}

async function setImageData(imageUrl, imageMetadata, imageThumbnail) {
  const nftMetadataCol = await getNftMetadataCollection();
  await nftMetadataCol.updateMany(
    { image: imageUrl },
    {
      $set: {
        imageMetadata,
        imageThumbnail,
      },
      $unset: {
        error: true,
      },
    }
  );
}

async function handleIpfsMetadataImage(imageIpfsUrl) {
  const imageCid = extractCid(imageIpfsUrl);
  if (!isCid(imageCid)) {
    return;
  }

  try {
    const { imageMetadata, imageThumbnail } = await fetchAndSharpImage(
      imageCid
    );
    await setImageData(imageIpfsUrl, imageMetadata, imageThumbnail);
  } catch (e) {
    await setImageError(imageIpfsUrl);
  }
}

async function handleMetadataDataURLImage(imageDataURL) {
  try {
    const { imageMetadata, imageThumbnail } = await sharpDataURL(imageDataURL);
    if (!imageMetadata || !imageThumbnail) {
      return;
    }
    await setImageData(imageDataURL, imageMetadata, imageThumbnail);
  } catch (e) {
    console.log(e.message);
    await setImageError(imageDataURL);
  }
}

async function handleMetadataImage(imageUrl) {
  if (imageUrl.startsWith("ipfs://")) {
    await handleIpfsMetadataImage(imageUrl);
  }

  const parsedDataUrl = parseDataURL(imageUrl);
  if (parsedDataUrl) {
    await handleMetadataDataURLImage(imageUrl);
  }
}

async function fetchAndSaveMetadataImagesFromIpfs() {
  const nftMetadataCol = await getNftMetadataCollection();
  const items = await nftMetadataCol
    .find({
      recognized: true,
      imageThumbnail: null,
      error: null,
    })
    .limit(10)
    .toArray();

  const promises = [];
  for (const metadata of items || []) {
    if (!metadata.recognized || !metadata.image) {
      continue;
    }

    promises.push(handleMetadataImage(metadata.image));
  }

  await Promise.all(promises);
}

async function handleImageByDataHash(dataHash) {
  const nftMetadataCol = await getNftMetadataCollection();
  const metadata = await nftMetadataCol.findOne({ dataHash });
  if (metadata.recognized && metadata.image) {
    await handleMetadataImage(metadata.image);
  }
}

module.exports = {
  fetchAndSaveMetadataImagesFromIpfs,
  handleImageByDataHash,
  handleMetadataImage,
};
