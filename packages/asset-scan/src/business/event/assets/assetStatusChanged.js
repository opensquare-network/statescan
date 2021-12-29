const {
  saveAsset,
  saveAssetTimeline,
} = require("../../../mongo/services/asset");
const { getAssetsMetadata } = require("../../common/metadata");
const { getAssetsAsset } = require("../../common/assetStorage");

async function handleAssetStatusChanged(
  event,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  blockIndexer
) {
  const { section, method, data } = event;
  const eventData = data.toJSON();
  const [assetId] = eventData;

  const asset = await getAssetsAsset(blockIndexer.blockHash, assetId);
  const metadata = await getAssetsMetadata(blockIndexer.blockHash, assetId);

  await saveAsset(
    blockIndexer,
    assetId,
    asset,
    metadata
  );
  await saveAssetTimeline(
    blockIndexer,
    assetId,
    section,
    method,
    eventData,
    eventSort,
    extrinsicIndex,
    extrinsicHash,
    asset,
    metadata,
  );
}

module.exports = {
  handleAssetStatusChanged,
};
