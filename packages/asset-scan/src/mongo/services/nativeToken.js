const {
  getBlockNativeTransfers,
  clearNativeTransfers,
} = require("../../business/common/store/blockNativeTokenTransfers");
const { getAssetTransferCollection } = require("..");
const {
  utils: { toDecimal128 },
} = require("@statescan/common");

async function flushNativeTokenTransfersToDb(blockHash) {
  const transfers = getBlockNativeTransfers(blockHash);
  if (transfers.length <= 0) {
    return;
  }

  const col = await getAssetTransferCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const transfer of transfers) {
    bulk.insert({
      ...transfer,
      balance: toDecimal128(transfer.balance),
    });
  }

  const result = await bulk.execute();
  if (result.result && !result.result.ok) {
    // TODO: handle failure
  }
  clearNativeTransfers(blockHash);
}

module.exports = {
  flushNativeTokenTransfersToDb,
};
