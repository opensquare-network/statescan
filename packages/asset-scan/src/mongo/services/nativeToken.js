const {
  addNativeTransfer,
  getBlockNativeTransfers,
  clearNativeTransfers,
} = require("./store/blockNativeTokenTransfers");
const { getAssetTransferCollection } = require("..");

async function saveNativeTokenTransfer(indexer, transfer) {
  addNativeTransfer(indexer.blockHash, transfer);
}

async function flushNativeTokenTransfersToDb(blockHash) {
  const transfers = getBlockNativeTransfers(blockHash);
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
  clearNativeTransfers(blockHash);
}

module.exports = {
  saveNativeTokenTransfer,
  flushNativeTokenTransfersToDb
};
