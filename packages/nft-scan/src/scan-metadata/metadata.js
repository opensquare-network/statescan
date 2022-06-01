const { parseRawOnchainMetadata } = require("./utils");
const { getNftMetadataCollection } = require("../mongo");

async function parseMetadataAndSave(dataHash, data) {
  if (!data) {
    return;
  }

  console.log(`Scanning meta data for`, dataHash);
  let nftImageData;
  try {
    nftImageData = await parseRawOnchainMetadata(data);
  } catch (e) {
    // fixme: should not set unrecognized when fail due to network connection problem
    console.error("Error with fetching data", e);
  }

  const nftMetadataCol = await getNftMetadataCollection();
  await nftMetadataCol.updateOne(
    { dataHash },
    {
      $set: {
        recognized: !!nftImageData,
        timestamp: new Date(),
        ...(nftImageData || {}),
      },
    }
  );

  if (!nftImageData) {
    console.log(`Result: unrecognized.`);
  } else {
    console.log("Result: recognized. data:", nftImageData);
  }
}

async function processNewMetadata() {
  const nftMetadataCol = await getNftMetadataCollection();
  let items =
    (await nftMetadataCol.find({ recognized: null }).limit(10).toArray()) || [];
  await Promise.all(
    items.map((item) => parseMetadataAndSave(item.dataHash, item.data))
  );
}

module.exports = {
  processNewMetadata,
  parseMetadataAndSave,
};