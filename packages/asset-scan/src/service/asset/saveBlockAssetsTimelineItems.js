const { hexToString } = require("@polkadot/util");
const { getAssetTimelineItems, clearAssetTimelineItems } = require("../../business/common/store/assetTimeline");
const { getAssetCollection, getAssetTimelineCollection } = require("../../mongo");

async function saveAssetsTimeline(indexer) {
  const assetCol = await getAssetCollection();
  const assetTimelineCol = await getAssetTimelineCollection();

  const assetTimelineItems = getAssetTimelineItems(indexer.blockHeight);
  for (const timelineItem of assetTimelineItems) {
    const {
      indexer,
      assetId,
      section,
      method,
      eventData,
      extrinsicHash,
      asset,
      metadata
    } = timelineItem;

    const assetObj = await assetCol.findOne({ assetId, destroyedAt: null });
    if (!assetObj) {
      return;
    }

    await assetTimelineCol.insertOne({
      indexer,
      assetId: assetObj.assetId,
      assetHeight: assetObj.createdAt.blockHeight,
      section,
      method,
      eventData,
      extrinsicHash,
      asset: {
        // fixme: we do not have to store detailed asset info to timeline
        ...asset,
        ...metadata,
        symbol: hexToString(metadata.symbol),
        name: hexToString(metadata.name),
      },
    });
  }
  clearAssetTimelineItems(indexer.blockHeight);
}

module.exports = {
  saveAssetsTimeline,
};
