const { getAssetCollection } = require("../../mongo");
const { getAssetsMetadata } = require("../../business/common/metadata");
const { getAssetsAsset } = require("../../business/common/assetStorage");
const {
  getAssetIds,
  clearAssetIds,
} = require("../../business/common/store/blockAsset");
const { hexToString } = require("@polkadot/util");

async function saveAssets(indexer) {
  const assetIds = getAssetIds(indexer.blockHeight);
  if (assetIds.length < 1) {
    return;
  }

  const promises = assetIds.map((assetId) =>
    getDetailAndMeta(assetId, indexer)
  );
  const assets = await Promise.all(promises);

  const col = await getAssetCollection();
  const bulk = col.initializeUnorderedBulkOp();

  for (const { assetId, detail, metadata } of assets) {
    if (!metadata) {
      throw new Error("No metadata found when save assets");
    }

    bulk
      .find({
        assetId: parseInt(assetId),
        destroyedAt: null,
      })
      .upsert()
      .update({
        $setOnInsert: {
          createdAt: indexer,
        },
        $set: {
          ...detail,
          ...metadata,
          symbol: hexToString(metadata.symbol),
          name: hexToString(metadata.name),
        },
      });
  }

  await bulk.execute();
  clearAssetIds(indexer.blockHeight);
}

async function getDetailAndMeta(assetId, indexer) {
  const asset = await getAssetsAsset(indexer.blockHash, assetId);
  const metadata = await getAssetsMetadata(indexer.blockHash, assetId);

  return {
    assetId,
    detail: asset,
    metadata,
  };
}

module.exports = {
  saveAssets,
};
