const { findBlockApi } = require("@statescan/utils");

async function getAssetsAccount(blockHash, assetId, address) {
  const blockApi = await findBlockApi(blockHash);

  const raw = await blockApi.query.assets.account(assetId, address);
  return raw.toJSON();
}

module.exports = {
  getAssetsAccount,
};
