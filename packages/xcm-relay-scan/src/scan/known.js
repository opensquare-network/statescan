const { scanBlock } = require("./block");
const { getNextScanHeight, updateScanHeight } = require("../mongo/scanHeight");
const {
  known: { getNextKnownHeights },
  fetchBlocks,
  sleep,
  logger,
} = require("@statescan/common");
const last = require("lodash.last");

let count = 0;

async function scanKnownHeights() {
  const toScanHeight = await getNextScanHeight();
  let heights = await getNextKnownHeights(toScanHeight);

  while (heights.length > 0) {
    const blocks = await fetchBlocks(heights, false);

    for (const block of blocks) {
      try {
        await scanBlock(block.block, block.events);
        await updateScanHeight(block.height);
      } catch (e) {
        await sleep(0);
        logger.error(`Error with block scan ${block.height}`, e);
      }
    }

    const lastHeight = last(blocks || [])?.height;
    logger.info(`${lastHeight} scan finished! - known height scan`);

    count++;
    if (count % 10 === 0) {
      console.log(`${lastHeight} restart process in case of memory leak`);
      process.exit(0);
    }

    heights = await getNextKnownHeights(lastHeight + 1);
  }
}

module.exports = {
  scanKnownHeights,
};
