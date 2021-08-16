const { getPagedBlocks } = require("../common/latestBlocks");
const { getFirstPageBlocks, setFirstPageBlocks } = require("./store");
const util = require("util");
const { firstPageBlocksRoom, FEED_INTERVAL } = require("./constants");

async function feedFirstPageBlocks(chain, io) {
  try {
    const oldData = getFirstPageBlocks(chain);
    const newData = await getPagedBlocks(chain, 0, 25);

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

module.exports = {
  feedFirstPageBlocks,
};
