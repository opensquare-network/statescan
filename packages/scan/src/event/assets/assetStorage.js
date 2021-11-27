const { findBlockApi } = require("@statescan/utils");

async function getAssetsAsset(blockHash, assetId) {
  const blockApi = await findBlockApi(blockHash);

  const raw = await blockApi.query.assets.asset(assetId);
  return raw.toJSON();
}

module.exports = {
  getAssetsAsset,
};
