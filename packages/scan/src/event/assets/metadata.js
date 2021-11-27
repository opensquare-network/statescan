const { findBlockApi } = require("@statescan/utils");

async function getAssetsMetadata(blockHash, assetId) {
  const blockApi = await findBlockApi(blockHash);

  const raw = await blockApi.query.assets.metadata(assetId);
  return raw.toJSON();
}

module.exports = {
  getAssetsMetadata,
};
