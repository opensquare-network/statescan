const { findBlockApi, getApi } = require("@statescan/common");
const { getAssetAccountStorageKey } = require("./accountKey");

async function getAssetAccounts(assetId, accounts = [], indexer) {
  if (accounts.length <= 0) {
    return;
  }

  const blockApi = await findBlockApi(indexer.blockHash);
  const storageKeys = accounts.map((account) =>
    getAssetAccountStorageKey(assetId, account, blockApi.registry)
  );
  const api = await getApi();
  const storageArray = await api.rpc.state.queryStorageAt(
    storageKeys,
    indexer.blockHash
  );

  return accounts.map((account, index) => {
    const storage = storageArray[index];
    let info = blockApi.registry.createType(
      "AssetBalance",
      storage.toHex(),
      true
    );
    info = {
      ...info.toJSON(),
      balance: info.balance.toString(),
    };
    return {
      account,
      info,
    };
  });
}

module.exports = {
  getAssetAccounts,
};
