const {
  getBlockNativeTransfers,
  clearNativeTransfers,
} = require("../store/blockNativeTokenTransfers");
const { getAssetTransferCollection } = require("../mongo");

async function saveData(indexer) {
  await saveNativeTokenTransfers(indexer.blockHeight);
}

async function saveNativeTokenTransfers(blockHeight) {
  const transfers = getBlockNativeTransfers(blockHeight);
  if (transfers.length <= 0) {
    return;
  }

  const col = await getAssetTransferCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const transfer of transfers) {
    bulk.insert(transfer);
  }

  const result = await bulk.execute();
  if (result.result && !result.result.ok) {
    // TODO: handle failure
  }
  clearNativeTransfers(blockHeight);
}

module.exports = {
  saveData,
};
