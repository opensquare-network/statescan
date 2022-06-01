require("dotenv").config();

const { processNewMetadata } = require("./metadata");
const { fetchAndSaveMetadataImagesFromIpfs } = require("./image");
const {
  getClassCollection,
  getInstanceCollection,
  getNftMetadataCollection,
} = require("../mongo");

async function addMetadataParsingTask(nftCol) {
  const items =
    (await nftCol.find({ dataHash: { $ne: null } }).toArray()) || [];
  if (items.length === 0) {
    return;
  }

  const nftMetadataCol = await getNftMetadataCollection();
  const batch = nftMetadataCol.initializeUnorderedBulkOp();
  for (const item of items) {
    batch
      .find({ dataHash: item.dataHash })
      .upsert()
      .update({
        $setOnInsert: {
          data: item.metadata.data,
        },
      });
  }

  await batch.execute();
}

async function main() {
  const classCol = await getClassCollection();
  const instanceCol = await getInstanceCollection();

  await addMetadataParsingTask(classCol);
  await addMetadataParsingTask(instanceCol);

  await processNewMetadata();
  await fetchAndSaveMetadataImagesFromIpfs();
}

main()
  .catch(console.error)
  .then(() => {
    process.exit(0);
  });
