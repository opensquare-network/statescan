const { getAsset, storeAsset } = require("./store/asset");
const { findBlockApi } = require("@statescan/common");

async function getAssetsAsset(blockHash, assetId) {
  const maybeAsset = getAsset(blockHash, assetId);
  if (maybeAsset) {
    return maybeAsset;
  }

  const blockApi = await findBlockApi(blockHash);

  const raw = await blockApi.query.assets.asset(assetId);
  const normalized = raw.toJSON();
  storeAsset(blockHash, assetId, normalized);
  return normalized;
}

module.exports = {
  getAssetsAsset,
};
