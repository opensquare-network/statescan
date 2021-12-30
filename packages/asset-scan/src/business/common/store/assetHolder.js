const holderMap = {};

function storeAssetHolder(blockHash, assetId, address, data) {
  holderMap[blockHash] = holderMap[blockHash] || {};
  holderMap[blockHash][`${assetId}/${address}`] = data;
}

function getAssetHolder(blockHash, assetId, address) {
  const dataInBlock = holderMap[blockHash];
  if (dataInBlock) {
    return dataInBlock[`${assetId}/${address}`];
  }

  return null;
}

function clearAssetHolder(blockHash) {
  delete holderMap[blockHash];
}

module.exports = {
  storeAssetHolder,
  getAssetHolder,
  clearAssetHolder,
};
