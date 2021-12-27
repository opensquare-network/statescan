const { normalizeBlock } = require("../utils/normalize/block");
const {
  chainHeight: { getLatestFinalizedHeight, getLatestUnFinalizedHeight },
} = require("@statescan/common");
const { getUnFinalizedBlockCollection } = require("../mongo");
const { fetchOneBlockFromNode } = require("@statescan/common");
const { saveBlocksEventData } = require("./events");
const { saveBlocksExtrinsicData } = require("./extrinsics");

let preScanFinalizedHeight = null;
let preScanUnFinalizedHeight = null;

async function updateUnFinalized() {
  const finalizedHeight = getLatestFinalizedHeight();
  const unFinalizedHeight = getLatestUnFinalizedHeight();
  if (
    preScanFinalizedHeight === finalizedHeight &&
    preScanUnFinalizedHeight === unFinalizedHeight
  ) {
    return;
  }

  if (finalizedHeight === unFinalizedHeight) {
    return;
  }

  let heights = [];
  for (let i = finalizedHeight + 1; i <= unFinalizedHeight; i++) {
    heights.push(i);
  }

  if (heights.length <= 0) {
    return;
  }

  const promises = heights.map((height) => fetchOneBlockFromNode(height));
  const blockDataArr = await Promise.all(promises);

  const normalizedBlocks = blockDataArr.map(normalizeBlock);
  await saveBlocks(normalizedBlocks);
  await saveBlocksEventData(blockDataArr);
  await saveBlocksExtrinsicData(blockDataArr);

  preScanFinalizedHeight = finalizedHeight;
  preScanUnFinalizedHeight = unFinalizedHeight;
}

async function saveBlocks(normalizedBlocks) {
  const unFinalizedBlockCol = await getUnFinalizedBlockCollection();
  const bulk = unFinalizedBlockCol.initializeOrderedBulkOp();

  bulk.find({}).delete();
  for (const block of normalizedBlocks) {
    bulk.insert(block);
  }

  await bulk.execute();
}

module.exports = {
  updateUnFinalized,
};
