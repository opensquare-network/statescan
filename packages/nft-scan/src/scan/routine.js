const { scanBlock } = require("./block");
const {
  logger,
  sleep,
  clearBlockApi,
  fetchBlocks,
  env: { firstScanKnowHeights },
  chainHeight: { getLatestFinalizedHeight },
  specs: { updateSpecs },
  scan: {
    utils: { getTargetHeight, getHeights, checkAndUpdateSpecs },
  },
} = require("@statescan/common");
const { getNextScanHeight, updateScanHeight } = require("../mongo/scanHeight");
const last = require("lodash.last");
const { scanKnownHeights } = require("./known");

async function beginRoutineScan() {
  await updateSpecs();

  if (firstScanKnowHeights()) {
    await scanKnownHeights();
  }

  let scanHeight = await getNextScanHeight();
  while (true) {
    clearBlockApi();
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
  const blocks = await fetchBlocks(heights, false);
  if ((blocks || []).length <= 0) {
    await sleep(1000);
    return startHeight;
  }

  for (const item of blocks) {
    // TODO: do following operations in one transaction
    try {
      await scanBlock(item.block, item.events);
      await updateScanHeight(item.height);
    } catch (e) {
      await sleep(1000);
      logger.error(`Error with block scan ${item.height}`, e);
      console.error(`Error with block scan ${item.height}`, e);
      throw e;
    }

    if (item.height % 100000 === 0) {
      process.exit(0);
    }
  }

  const lastHeight = last(blocks || []).height;
  logger.info(`${startHeight} - ${lastHeight} done!`);
  return lastHeight + 1;
}

module.exports = {
  beginRoutineScan,
};
