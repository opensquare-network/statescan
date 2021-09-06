// key: blockHeight, value: native token transfers
const transfersMap = {};

function addTransfer(height, transfer) {
  if (!transfersMap[height]) {
    transfersMap[height] = [transfer];
  } else {
    transfersMap[height].push(transfer);
  }
}

function addTransfers(height, transfers = []) {
  if (!transfersMap[height]) {
    transfersMap[height] = transfers;
  } else {
    transfersMap[height].push(...transfers);
  }
}

function getBlockTransfers(height) {
  return transfersMap[height] || [];
}

function clearTransfers(height) {
  delete transfersMap[height];
}

module.exports = {
  addNativeTransfer: addTransfer,
  addNativeTransfers: addTransfers,
  getBlockNativeTransfers: getBlockTransfers,
  clearNativeTransfers: clearTransfers,
};
