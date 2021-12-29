const { getApi } = require("@statescan/common");

async function getBlockByHeight(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  return block;
}

module.exports = {
  getBlockByHeight,
};
