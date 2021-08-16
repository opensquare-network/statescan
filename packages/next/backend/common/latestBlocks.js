const {
  getBlockCollection,
  getUnFinalizedBlockCollection,
} = require("../mongo");

async function getLatestBlocks(chain, n = 5) {
  const blocks = await getPagedBlocks(chain, 0, n);
  return blocks.slice(0, n);
}

async function getPagedBlocks(chain, page, pageSize) {
  const blockCol = await getBlockCollection(chain);
  const finalizedBlocks = await getColBlocks(blockCol, page, pageSize);

  if (page > 0) {
    return finalizedBlocks;
  }

  const col = await getUnFinalizedBlockCollection(chain);
  const unFinalizedBlocks = await getColBlocks(col, 0, 1000, false);
  return [...unFinalizedBlocks, ...finalizedBlocks];
}

async function getColBlocks(col, page, pageSize, isFinalized = true) {
  const items = await col
    .find({})
    .sort({
      "header.number": -1,
    })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  return (items || []).map((item) => ({
    ...item,
    isFinalized,
  }));
}

module.exports = {
  getLatestBlocks,
  getPagedBlocks,
};
