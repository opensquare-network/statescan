const { scanBlock } = require("./block");
const { fetchBlocks } = require("../chain/fetchBlocks");
const { getScanStep, isUseMetaDb } = require("../env");
const { sleep } = require("../utils/sleep");
const { getLatestHeight } = require("../chain/finalizedHead");
const { getNextScanHeight } = require("../mongo/scanHeight");
const { logger } = require("../logger");
const last = require("lodash.last");
const { getSpecHeights, updateSpecs } = require("../chain/specs");

async function beginRoutineScan() {
  let scanHeight = await getNextScanHeight();
  while (true) {
    scanHeight = await oneStepScan(scanHeight);
  }
}

async function oneStepScan(startHeight) {
  const chainHeight = getLatestHeight();
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
    // TODO: do following operations in one transaction
    try {
      await scanBlock(item.block, item.events);
    } catch (e) {
      await sleep(1000);
      logger.error(`Error with block scan ${item.height}`, e);
    }
  }

  const lastHeight = last(blocks || []).height;
  logger.info(`${startHeight} - ${lastHeight} done!`);
  return lastHeight + 1;
}

function getTargetHeight(startHeight) {
  const chainHeight = getLatestHeight();

  let targetHeight = chainHeight;
  const step = getScanStep();
  if (startHeight + step < chainHeight) {
    targetHeight = startHeight + step;
  }

  return targetHeight;
}

function getHeights(start, end) {
  const heights = [];
  for (let i = start; i <= end; i++) {
    heights.push(i);
  }

  return heights;
}

async function checkAndUpdateSpecs(targetHeight) {
  if (!isUseMetaDb()) {
    return;
  }

  const specHeights = getSpecHeights();
  if (targetHeight > last(specHeights)) {
    await updateSpecs();
  }
}

module.exports = {
  beginRoutineScan,
};
