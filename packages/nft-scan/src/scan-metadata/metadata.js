const { parseRawOnchainMetadata } = require("./utils");
const { getNftMetadataCollection } = require("../mongo");

async function parseMetadataAndSave(dataHash, data) {
  if (!data) {
    return;
  }

  const nftMetadataCol = await getNftMetadataCollection();

  console.log(`Scanning meta data for`, dataHash);
  let nftImageData;
  try {
    nftImageData = await parseRawOnchainMetadata(data);
  } catch (e) {
    console.error("Error with fetching data", e.toString());
    await nftMetadataCol.updateOne(
      { dataHash },
      {
        $inc: { retries: 1 },
        $set: { lastRetryTime: new Date() },
      }
    );
    return;
  }

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
    (await nftMetadataCol
      .find({
        recognized: null,
        $or: [{ retries: null }, { retries: { $ne: null, $lt: 20 } }],
      })
      .limit(10)
      .toArray()) || [];
  await Promise.all(
    items.map((item) => parseMetadataAndSave(item.dataHash, item.data))
  );
}

module.exports = {
  processNewMetadata,
  parseMetadataAndSave,
};
