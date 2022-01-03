const heightAssetMap = {};

function addAssetId(height, assetId) {
  if (!heightAssetMap[height]) {
    heightAssetMap[height] = [assetId];
  } else {
    heightAssetMap[height].push(assetId);
  }
}

function getAssetIds(height) {
  return heightAssetMap[height] || [];
}

function clearAssetIds(height) {
  delete heightAssetMap[height];
}

module.exports = {
  addAssetId,
  getAssetIds,
  clearAssetIds,
};
