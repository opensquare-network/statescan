const { getApi } = require("@statescan/utils");

async function findBlockHash(height) {
  const api = await getApi();
  return api.rpc.chain.getBlockHash(height);
}

module.exports = {
  findBlockHash,
};
