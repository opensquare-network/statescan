const { getMeta, storeMeta } = require("./store/assetMeta");
const { findBlockApi } = require("@statescan/common");

async function getAssetsMetadata(blockHash, assetId) {
  const maybeMeta = getMeta(blockHash, assetId);
  if (maybeMeta) {
    return maybeMeta;
  }

  const blockApi = await findBlockApi(blockHash);

  const raw = await blockApi.query.assets.metadata(assetId);
  const normalized = raw.toJSON();
  storeMeta(blockHash, assetId, normalized);
  return normalized;
}

module.exports = {
  getAssetsMetadata,
};
