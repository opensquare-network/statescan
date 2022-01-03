const { getApi } = require("@statescan/common");
const { getAccountStorageKey } = require("./accountStorageKey");

async function getOnChainAccounts(addrs = []) {
  const uniqueAddrs = [...new Set(addrs)];
  const keys = uniqueAddrs.map(getAccountStorageKey);
  const api = await getApi();
  const result = await api.rpc.state.queryStorageAt(keys);
  const accountInfoHexArr = (result || []).map((i) => i.toHex());

  return uniqueAddrs.reduce((result, address, idx) => {
    const accountInfoHex = accountInfoHexArr[idx];
    if (!accountInfoHex) {
      return result;
    }

    const accountInfo = api.registry.createType(
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
