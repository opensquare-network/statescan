const { getRawAddressCollection } = require("../mongo");
const { saveAssets } = require("./asset/saveBlockAssets");
const { saveAssetsTimeline } = require("./asset/saveBlockAssetsTimelineItems");
const {
  queryAndSaveAssetAccountsToDb,
} = require("./assetAccount/syncAssetAddresses");
const { flushAssetTransfersToDb } = require("../mongo/services/asset");
const {
  flushNativeTokenTransfersToDb,
} = require("../mongo/services/nativeToken");
const {
  db: { updateRawAddrs },
} = require("@statescan/common");

async function flushData(indexer) {
  await saveAssets(indexer);
  await saveAssetsTimeline(indexer);

  await flushNativeTokenTransfersToDb(indexer.blockHash);
  await flushAssetTransfersToDb(indexer.blockHash);

  await queryAndSaveAssetAccountsToDb(indexer);
  await updateRawAddrs(indexer, await getRawAddressCollection());
}

module.exports = {
  flushData,
};
