const assetHolderMap = {};

function storeAssetHolder(blockHash, assetId, address, data) {
  assetHolderMap[blockHash] = assetHolderMap[blockHash] || {};
  assetHolderMap[blockHash][`${assetId}/${address}`] = data;
}

function getAssetHolders(blockHash) {
  const dataInBlock = assetHolderMap[blockHash];
  if (dataInBlock) {
    return dataInBlock;
  }

  return [];
}

function clearAssetHolders(blockHash) {
  delete assetHolderMap[blockHash];
}

module.exports = {
  storeAssetHolder,
  getAssetHolders,
  clearAssetHolders,
};
