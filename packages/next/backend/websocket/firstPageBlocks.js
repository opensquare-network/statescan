const { getPagedBlocks } = require("../common/latestBlocks");
const { getFirstPageBlocks, setFirstPageBlocks } = require("./store");
const util = require("util");
const { getBlockCollection } = require("../mongo");
const { firstPageBlocksRoom, FEED_INTERVAL } = require("./constants");

async function feedFirstPageBlocks(chain, io) {
  try {
    const oldData = getFirstPageBlocks(chain);
    const newData = await getBlocks(chain);

    if (util.isDeepStrictEqual(oldData, newData)) {
      return;
    }

    setFirstPageBlocks(chain, newData);
    io.to(firstPageBlocksRoom).emit("firstPageBlocks", newData);
  } catch (e) {
    console.error("feed overview error:", e);
  } finally {
    setTimeout(feedFirstPageBlocks.bind(null, chain, io), FEED_INTERVAL);
  }
}

async function getBlocks(chain) {
  const page = 0;
  const pageSize = 25;

  const blocks = await getPagedBlocks(chain, page, pageSize);
  const col = await getBlockCollection(chain);
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
