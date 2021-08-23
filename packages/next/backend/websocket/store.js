const data = {
  scanHeight: 0,
  overview: null,
  firstPageBlocks: [],
};

function setScanHeight(height) {
  data.scanHeight = height;
}

function getScanHeight() {
  return data.scanHeight;
}

function getFirstPageBlocks() {
  return data.firstPageBlocks;
}

function setFirstPageBlocks(blocks) {
  data.firstPageBlocks = blocks;
}

function setOverview(arg) {
  data.overview = arg;
}

function getOverview() {
  return data.overview;
}

module.exports = {
  setScanHeight,
  getScanHeight,
  setOverview,
  getOverview,
  getFirstPageBlocks,
  setFirstPageBlocks,
};
