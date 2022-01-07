const transferMap = {};

function addTransfer(blockHash, data) {
  transferMap[blockHash] = transferMap[blockHash] || [];
  transferMap[blockHash].push(data);
}

function getTransfers(blockHash) {
  const dataInBlock = transferMap[blockHash];
  if (dataInBlock) {
    return dataInBlock;
  }

  return [];
}

function clearTransfers(blockHash) {
  delete transferMap[blockHash];
}

module.exports = {
  addAssetTransfer: addTransfer,
  getAssetTransfers: getTransfers,
  clearAssetTransfers: clearTransfers,
};
