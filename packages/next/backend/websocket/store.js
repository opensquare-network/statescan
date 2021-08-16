const data = {
  westmint: {
    scanHeight: 0,
    overview: null,
    firstPageBlocks: [],
  },
  statemine: {
    scanHeight: 0,
    overview: null,
    firstPageBlocks: [],
  },
};

function setScanHeight(chain, height) {
  if (data[chain]) {
    data[chain].scanHeight = height;
  }
}

function getScanHeight(chain) {
  return data[chain]?.scanHeight;
}

function getFirstPageBlocks(chain) {
  return data[chain]?.firstPageBlocks;
}

function setFirstPageBlocks(chain, blocks) {
  if (data[chain]) {
    data[chain].firstPageBlocks = blocks;
  }
}

function setOverview(chain, arg) {
  if (data[chain]) {
    data[chain].overview = arg;
  }
}

function getOverview(chain) {
  return data[chain]?.overview;
}

module.exports = {
  setScanHeight,
  getScanHeight,
  setOverview,
  getOverview,
  getFirstPageBlocks,
  setFirstPageBlocks,
};
