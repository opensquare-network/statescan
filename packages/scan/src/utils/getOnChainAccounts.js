const { findRegistry } = require("../specs");
const { getApi } = require("../api");
const { getAccountStorageKey } = require("./accountStorageKey");

async function getOnChainAccounts(indexer, addrs = []) {
  const uniqueAddrs = [...new Set(addrs)];
  const keys = uniqueAddrs.map(getAccountStorageKey);
  const api = await getApi();
  const result = await api.rpc.state.queryStorageAt(keys, indexer.blockHash);
  const accountInfoHexArr = (result || []).map((i) => i.toHex());

  const registry = await findRegistry(indexer.blockHeight);
  return uniqueAddrs.reduce((result, address, idx) => {
    const accountInfoHex = accountInfoHexArr[idx];
    if (!accountInfoHex) {
      return result;
    }

    const accountInfo = registry.createType(
      "AccountInfo",
      accountInfoHex,
      true
    );
    result.push({ address, info: accountInfo.toJSON() });
    return result;
  }, []);
}

module.exports = {
  getOnChainAccounts,
};
