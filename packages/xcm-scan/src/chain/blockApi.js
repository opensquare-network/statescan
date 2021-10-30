const { getApi } = require("../api");
let blockApiMap = {};
const { isUseMetaDb } = require("../env");
const { findBlockApiByHeight: findSpecApi } = require("./specs");

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

async function findBlockApiByHeight(height) {
  if (isUseMetaDb()) {
    return await findSpecApi(height);
  }

  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  return await findBlockApi(blockHash);
}

async function removeBlockApi(blockHash) {
  delete blockApiMap[blockHash];
}

module.exports = {
  findBlockApi,
  findBlockApiByHeight,
  removeBlockApi,
};
