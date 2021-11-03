const dotenv = require('dotenv');
dotenv.config();

const {
  getClassCollection,
  getInstanceCollection,
  getIpfsMetadataCollection,
} = require("../mongo");
const { scanMeta, scanMetaImage } = require('./utils');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function queueIpfsTask(nftCol) {
  const items = await nftCol.find({ "metadata.data": { $ne: null } }).toArray();

  if (items.length === 0) {
    return;
  }

  const ipfsMetadataCol = await getIpfsMetadataCollection();
  const batch = ipfsMetadataCol.initializeUnorderedBulkOp();

  items.forEach(item =>
    batch.find({ dataId: item.metadata.data })
    .upsert()
    .update({
      $set: {
        dataId: item.metadata.data,
      },
    })
  );

  await batch.execute();

}

async function main() {
  while (true) {
    console.log(`Last IPFS scan run at`, new Date());

    const classCol = await getClassCollection();
    const instanceCol = await getInstanceCollection();

    await queueIpfsTask(classCol);
    await queueIpfsTask(instanceCol);

    const ipfsMetadataCol = await getIpfsMetadataCollection();
    let items = await ipfsMetadataCol.find({ recognized: null }).limit(10).toArray();
    await Promise.all(items.map(item => scanMeta(item.dataId)));

    items = await ipfsMetadataCol.find({ recognized: true, imageThumbnail: null }).limit(10).toArray();
    await Promise.all(items.map(item => scanMetaImage(item.dataId)));

    await sleep(5000);
  }
}

main().catch(console.error).then(() => {
  process.exit(0);
});
