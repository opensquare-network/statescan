const {
  flushAssetsToDb,
  flushAssetTransfersToDb,
  flushAssetHoldersToDb,
} = require("../mongo/services/asset");
const {
  flushNativeTokenTransfersToDb,
} = require("../mongo/services/nativeToken");

async function flushData(indexer) {
  await flushNativeTokenTransfersToDb(indexer.blockHash);
  await flushAssetsToDb(indexer.blockHash);
  await flushAssetTransfersToDb(indexer.blockHash);
  await flushAssetHoldersToDb(indexer.blockHash);
}

module.exports = {
  flushData,
};
