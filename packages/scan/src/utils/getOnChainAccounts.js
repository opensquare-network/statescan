const { findBlockApi } = require("@statescan/utils");
const { getApi } = require("@statescan/utils");
const { getAccountStorageKey } = require("./accountStorageKey");

async function getOnChainAccounts(indexer, addrs = []) {
  const uniqueAddrs = [...new Set(addrs)];
  const keys = uniqueAddrs.map(getAccountStorageKey);
  const api = await getApi();
  const result = await api.rpc.state.queryStorageAt(keys, indexer.blockHash);
  const accountInfoHexArr = (result || []).map((i) => i.toHex());

  const blockApi = await findBlockApi(indexer.blockHash);
  return uniqueAddrs.reduce((result, address, idx) => {
    const accountInfoHex = accountInfoHexArr[idx];
    if (!accountInfoHex) {
      return result;
    }

    const accountInfo = blockApi.registry.createType(
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
