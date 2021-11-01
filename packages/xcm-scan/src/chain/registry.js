const { getApi } = require("../api");

async function getRegistryByHeight(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  return (await api.getBlockRegistry(blockHash)).registry;
}

module.exports = {
  getRegistryByHeight,
};
