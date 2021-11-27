const { getApi } = require("@statescan/utils");
let blockApiMap = {};

function setBlockApi(blockHash, api) {
  blockApiMap[blockHash] = api;
}

async function findBlockApi(blockHash) {
  const maybe = blockApiMap[blockHash];
  if (maybe) {
    return maybe;
  }

  const api = await getApi();
  const blockApi = await api.at(blockHash);

  setBlockApi(blockHash, blockApi);
  return blockApi;
}

function removeBlockApi(blockHash) {
  delete blockApiMap[blockHash];
}

module.exports = {
  findBlockApi,
  removeBlockApi,
};
