const { getAssetHolder, storeAssetHolder } = require("./store/assetHolder");
const { findBlockApi } = require("@statescan/common");

async function getAssetsAccount(blockHash, assetId, address) {
  const maybeAccount = getAssetHolder(blockHash, assetId, address);
  if (maybeAccount) {
    return maybeAccount;
  }

  const blockApi = await findBlockApi(blockHash);

  const raw = await blockApi.query.assets.account(assetId, address);
  const normalized = raw.toJSON();
  storeAssetHolder(blockHash, assetId, address, normalized);
  return normalized;
}

module.exports = {
  getAssetsAccount,
};
