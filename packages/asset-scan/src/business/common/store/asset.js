const assetMap = {};

function storeAsset(blockHash, assetId, data) {
  assetMap[blockHash] = assetMap[blockHash] || {};
  assetMap[blockHash][assetId] = data;
}

function getAsset(blockHash, assetId) {
  const dataInBlock = assetMap[blockHash];
  if (dataInBlock) {
    return dataInBlock[assetId];
  }

  return null;
}

function clearAsset(blockHash) {
  delete assetMap[blockHash];
}

module.exports = {
  storeAsset,
  getAsset,
  clearAsset,
};
