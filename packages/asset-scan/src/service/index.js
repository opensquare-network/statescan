const {
  getBlockNativeTransfers,
  clearNativeTransfers,
} = require("../store/blockNativeTokenTransfers");
const {
  getAssetTransferCollection,
} = require("../mongo");

async function saveData(indexer, session) {
  await saveNativeTokenTransfers(indexer.blockHeight, session);
}

async function saveNativeTokenTransfers(blockHeight, session) {
  const transfers = getBlockNativeTransfers(blockHeight);
  if (transfers.length <= 0) {
    return;
  }

  const col = await getAssetTransferCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const transfer of transfers) {
    bulk.insert(transfer);
  }

  const result = await bulk.execute({ session });
  if (result.result && !result.result.ok) {
    // TODO: handle failure
  }
  clearNativeTransfers(blockHeight);
}

module.exports = {
  saveData,
};
