const { fetchMetadataFromIpfsByHex } = require("./utils");
const { getNftMetadataCollection } = require("../mongo");

async function scanMetadataAndSave(dataHash, data) {
  if (!data) {
    return;
  }

  console.log(`Scanning ipfs meta data for`, dataHash);
  let nftIPFSData;
  try {
    nftIPFSData = await fetchMetadataFromIpfsByHex(data);
  } catch (e) {
    // fixme: should not set unrecognized when fail due to network connection problem
    console.error("Error with fetching data from ipfs", e);
  }

  const nftMetadataCol = await getNftMetadataCollection();
  if (!nftIPFSData) {
    await nftMetadataCol.updateOne(
      { dataHash },
      {
        $set: {
          recognized: false,
          timestamp: new Date(),
        },
      }
    );
    console.log(`Result: unrecognized.`);
    return;
  }

  await nftMetadataCol.updateOne(
    { dataHash },
    {
      $set: {
        ...nftIPFSData,
        recognized: true,
        timestamp: new Date(),
      },
    }
  );
  console.log("Result: recognized. data:", nftIPFSData);
}

async function fetchAndSaveMetaDataFromIpfs() {
  const nftMetadataCol = await getNftMetadataCollection();
  let items =
    (await nftMetadataCol.find({ recognized: null }).limit(10).toArray()) || [];
  await Promise.all(
    items.map((item) => scanMetadataAndSave(item.dataHash, item.data))
  );
}

module.exports = {
  fetchAndSaveMetaDataFromIpfs,
};
