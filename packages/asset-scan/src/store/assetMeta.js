const metaMap = {};

function storeMeta(blockHash, assetId, metadata) {
  metaMap[blockHash][assetId] = metadata;
}

function getMeta(blockHash, assetId) {
  const metaInBlock = metaMap[blockHash];
  if (metaInBlock) {
    return metaInBlock[assetId];
  }

  return null;
}

function clearMeta(blockHash) {
  delete metaMap[blockHash];
}

module.exports = {
  storeMeta,
  getMeta,
  clearMeta,
};
