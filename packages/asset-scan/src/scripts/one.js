require("dotenv").config();

const { getBlockIndexer, getApi } = require("@statescan/common");
const { fetchOneBlockFromNode } = require("@statescan/common");
const { chainHeight: { updateHeight, getLatestFinalizedHeight } } = require("@statescan/common");
const {
  getAssetCollection,
  getAssetTransferCollection,
} = require("../mongo");

async function fetchAndSave(height) {
  const blockData = await fetchOneBlockFromNode(height);

  const blockIndexer = getBlockIndexer(blockData.block);
  await saveBusiness(blockData, blockIndexer);
}

async function saveBusiness({ block, events }, blockIndexer) {
  const transfers = [];

  const assetCol = await getAssetCollection();
  let sort = 0;
  for (const rawEvent of events) {
    const { event, phase } = rawEvent;
    if (!phase.isNull) {
      const phaseValue = phase.value.toNumber();
      const extrinsic = block.extrinsics[phaseValue];
      const extrinsicHash = extrinsic.hash.toHex();
      const extrinsicIndex = phaseValue;
      const { section: extrinsicSection, method: extrinsicMethod } = extrinsic.method;

      const { section, method, data } = event;
      if (section === "assets" && method === "Transferred") {
        const [assetId, from, to, balance] = data.toJSON();
        const asset = await assetCol.findOne({ assetId, destroyedAt: null });
        if (!asset) {
          continue;
        }

        transfers.push({
          indexer: blockIndexer,
          eventSort: sort,
          extrinsicIndex,
          extrinsicHash,
          module: extrinsicSection,
          method: extrinsicMethod,
          asset: asset._id,
          from,
          to,
          balance,
        });
      } else if (section === "balances" && method === "Transfer") {
        const [from, to, balance] = data.toJSON();
        transfers.push({
          indexer: blockIndexer,
          eventSort: sort,
          extrinsicIndex,
          extrinsicHash,
          module: extrinsicSection,
          method: extrinsicMethod,
          from,
          to,
          balance,
        });
      }
    }

    sort++;
  }

  const transferCol = await getAssetTransferCollection();
  const bulk = transferCol.initializeOrderedBulkOp();
  bulk.find({ "indexer.blockHeight": blockIndexer.blockHeight }).delete();
  for (const transfer of transfers) {
    bulk.insert(transfer);
  }

  await bulk.execute();
}

async function main() {
  const myArgs = process.argv.slice(2);
  if ((myArgs || []).length <= 0) {
    console.error("Please specify the block height");
    process.exit(1);
  }

  const arg1 = myArgs[0];
  const height = parseInt(arg1);
  if (isNaN(height)) {
    console.error("Wrong block height");
    process.exit(1);
  }

  await updateHeight();
  const api = await getApi();
  const finalizedHeight = getLatestFinalizedHeight();
  if (height > finalizedHeight) {
    console.error("Block height can not be greater than the finalized height");
    await api.disconnect();
    process.exit(1);
  }

  await fetchAndSave(height);
  console.log(`block ${height} have been saved!`);
  await api.disconnect();
  process.exit(0);
}

main().catch(console.error);
