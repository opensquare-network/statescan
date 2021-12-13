const { scanBlock } = require("./block");
const { getNextScanHeight, updateScanHeight } = require("../mongo/scanHeight");
const {
  known: { getNextKnownHeights },
  fetchBlocks,
  sleep,
  logger,
  mem: { exitWhenTooMuchMem },
} = require("@statescan/common");
const last = require("lodash.last");

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

    exitWhenTooMuchMem();
    heights = await getNextKnownHeights(lastHeight + 1);
  }
}

module.exports = {
  scanKnownHeights,
};
