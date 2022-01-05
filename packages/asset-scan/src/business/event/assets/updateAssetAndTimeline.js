const { addAssetId } = require("../../common/store/blockAsset");
const { addAssetTimelineItem } = require("../../common/store/assetTimeline");
const { getAssetsMetadata } = require("../../common/metadata");
const { getAssetsAsset } = require("../../common/assetStorage");

async function updateAssetAndTimeline(event, indexer, extrinsic) {
  const { section, method, data } = event;
  const eventData = data.toJSON();
  const [assetId] = eventData;

  const extrinsicHash = extrinsic.hash.toJSON();

  const asset = await getAssetsAsset(indexer.blockHash, assetId);
  const metadata = await getAssetsMetadata(indexer.blockHash, assetId);

  addAssetId(indexer.blockHeight, assetId);
  addAssetTimelineItem(indexer.blockHeight, {
    indexer,
    assetId,
    section,
    method,
    eventData,
    extrinsicHash,
    asset,
    metadata
  });
}

module.exports = {
  updateAssetAndTimeline,
};
