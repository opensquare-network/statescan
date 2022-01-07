const { addAssetId } = require("../../common/store/blockAsset");
const { saveAssetTimeline } = require("../../../mongo/services/asset");
const { getAssetsMetadata } = require("../../common/metadata");
const { getAssetsAsset } = require("../../common/assetStorage");
const { saveAssets } = require("../../../service/asset/saveBlockAssets");

async function createAssetAndTimeline(event, indexer, extrinsic) {
  const { section, method, data } = event;
  const eventData = data.toJSON();
  const [assetId] = eventData;

  const extrinsicHash = extrinsic.hash.toJSON();

  const asset = await getAssetsAsset(indexer.blockHash, assetId);
  const metadata = await getAssetsMetadata(indexer.blockHash, assetId);

  addAssetId(indexer.blockHeight, assetId);
  // Make sure that asset is added to the db in a timely manner
  await saveAssets(indexer);

  await saveAssetTimeline(
    indexer,
    assetId,
    section,
    method,
    eventData,
    extrinsicHash,
    asset,
    metadata
  );
}

module.exports = {
  createAssetAndTimeline,
};
