const { saveAssets } = require("./asset/saveBlockAssets");
const {
  queryAndSaveAssetAccountsToDb,
} = require("./assetAccount/syncAssetAddresses");
const { flushAssetTransfersToDb } = require("../mongo/services/asset");
const {
  flushNativeTokenTransfersToDb,
} = require("../mongo/services/nativeToken");

async function flushData(indexer) {
  await saveAssets(indexer);

  await flushNativeTokenTransfersToDb(indexer.blockHash);
  await flushAssetTransfersToDb(indexer.blockHash);

  await queryAndSaveAssetAccountsToDb(indexer);
}

module.exports = {
  flushData,
};
