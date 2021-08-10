const { getAllVersionChangeHeights } = require("../meta");

let versionChangedHeights = [];

async function updateSpecs() {
  versionChangedHeights = await getAllVersionChangeHeights();
}

function getSpecHeights() {
  return versionChangedHeights;
}

module.exports = {
  updateSpecs,
  getSpecHeights,
};
