const {
  logger,
  sleep,
  fetchBlocks,
  chainHeight: { getLatestFinalizedHeight },
  env: { firstScanKnowHeights },
  specs: { updateSpecs },
  scan: {
    utils: { getTargetHeight, getHeights, checkAndUpdateSpecs },
  },
  getBlockIndexer,
  db: { updateRawAddrs },
} = require("@statescan/common");
const { getNextScanHeight, updateScanHeight } = require("../mongo/scanHeight");
const last = require("lodash.last");
const { getRawAddressCollection } = require("../mongo/account");
const { deleteFromHeight } = require("../mongo/service");
const { scanBlock } = require("./block");
const { scanKnownHeights } = require("./known");

async function beginScan() {
  await updateSpecs();

  if (firstScanKnowHeights()) {
    await scanKnownHeights();
  }

  let scanHeight = await getNextScanHeight();
  await deleteFromHeight(scanHeight);
  while (true) {
    scanHeight = await oneStepScan(scanHeight);
  }
}

async function oneStepScan(startHeight) {
  const chainHeight = getLatestFinalizedHeight();
  if (startHeight > chainHeight) {
    // Just wait if the to scan height greater than current chain height
    await sleep(3000);
    return startHeight;
  }

  const targetHeight = getTargetHeight(startHeight);
  await checkAndUpdateSpecs(targetHeight);

  const heights = getHeights(startHeight, targetHeight);
  const blocks = await fetchBlocks(heights);
  if ((blocks || []).length <= 0) {
    await sleep(1000);
    return startHeight;
  }

  for (const item of blocks) {
    try {
      const blockIndexer = getBlockIndexer(item.block);
      await scanBlock(item.block, item.events);
      await updateScanHeight(item.height);

      await updateRawAddrs(blockIndexer, await getRawAddressCollection());
    } catch (e) {
      await sleep(1000);
      logger.error(`Error with block scan ${item.height}`, e);
    }
  }

  const lastHeight = last(blocks || []).height;
  logger.info(`${startHeight} - ${lastHeight} done!`);
  return lastHeight + 1;
}

module.exports = {
  beginScan,
};
