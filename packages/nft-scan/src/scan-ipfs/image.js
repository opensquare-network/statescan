const { getNftMetadataCollection } = require("../mongo");
const isIPFS = require("is-ipfs");
const { fetchAndSharpImage } = require("./utils");

async function setImageError(imageIpfsUrl) {
  const nftMetadataCol = await getNftMetadataCollection();
  await nftMetadataCol.updateMany(
    { image: imageIpfsUrl },
    {
      $set: {
        error: "imageError",
      },
    }
  );
}

async function setImageData(imageIpfsUrl, imageMetadata, imageThumbnail) {
  const nftMetadataCol = await getNftMetadataCollection();
  await nftMetadataCol.updateMany(
    { image: imageIpfsUrl },
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

async function handleMetadataImage(imageIpfsUrl) {
  if (!imageIpfsUrl.startsWith("ipfs://")) {
    return;
  }

  const imageCid = imageIpfsUrl.split("/").pop();
  if (!imageCid) {
    return;
  }

  if (!isIPFS.cid(imageCid) && !isIPFS.base32cid(imageCid.toLowerCase())) {
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
};
