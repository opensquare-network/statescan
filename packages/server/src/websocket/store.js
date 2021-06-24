const data = {
  westmint: {
    scanHeight: 0,
    overview: null,
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
};
