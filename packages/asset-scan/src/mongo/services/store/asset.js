const assetMap = {};

function storeAsset(blockHash, assetId, data) {
  assetMap[blockHash] = assetMap[blockHash] || {};
  assetMap[blockHash][assetId] = data;
}

function getAssets(blockHash) {
  const dataInBlock = assetMap[blockHash];
  if (dataInBlock) {
    return dataInBlock;
  }

  return [];
}

function clearAssets(blockHash) {
  delete assetMap[blockHash];
}

module.exports = {
  storeAsset,
  getAssets,
  clearAssets,
};
