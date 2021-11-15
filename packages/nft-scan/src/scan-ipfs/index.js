require("dotenv").config();

const { sleep } = require("../utils/sleep");

const {
  getClassCollection,
  getInstanceCollection,
  getNftMetadataCollection,
} = require("../mongo");
const { scanMeta, scanMetaImage } = require("./utils");

async function queueIpfsTask(nftCol) {
  const items =
    (await nftCol.find({ "dataHash": { $ne: null } }).toArray()) || [];
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
  while (true) {
    console.log(`Last IPFS scan run at`, new Date());

    const classCol = await getClassCollection();
    const instanceCol = await getInstanceCollection();

    await queueIpfsTask(classCol);
    await queueIpfsTask(instanceCol);

    const nftMetadataCol = await getNftMetadataCollection();
    let items =
      (await nftMetadataCol.find({ recognized: null }).limit(10).toArray()) ||
      [];
    await Promise.all(items.map((item) => scanMeta(item.dataHash, item.data)));

    items = await nftMetadataCol
      .find({ recognized: true, imageThumbnail: null })
      .limit(10)
      .toArray();
    await Promise.all(items.map((item) => scanMetaImage(item.dataHash)));

    await sleep(5000);
  }
}

main()
  .catch(console.error)
  .then(() => {
    process.exit(0);
  });
