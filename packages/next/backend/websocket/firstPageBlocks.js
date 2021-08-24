const { getPagedBlocks } = require("../common/latestBlocks");
const { getFirstPageBlocks, setFirstPageBlocks } = require("./store");
const util = require("util");
const { getBlockCollection } = require("../mongo");
const { firstPageBlocksRoom, FEED_INTERVAL } = require("./constants");

async function feedFirstPageBlocks(io) {
  try {
    const oldData = getFirstPageBlocks();
    const newData = await getBlocks();

    if (util.isDeepStrictEqual(oldData, newData)) {
      return;
    }

    setFirstPageBlocks(newData);
    io.to(firstPageBlocksRoom).emit("firstPageBlocks", newData);
  } catch (e) {
    console.error("feed overview error:", e);
  } finally {
    setTimeout(feedFirstPageBlocks.bind(null, io), FEED_INTERVAL);
  }
}

async function getBlocks() {
  const page = 0;
  const pageSize = 25;

  const blocks = await getPagedBlocks(page, pageSize);
  const col = await getBlockCollection();
  const total = await col.estimatedDocumentCount();

  return {
    items: blocks,
    page,
    pageSize,
    total,
  };
}

module.exports = {
  feedFirstPageBlocks,
};
