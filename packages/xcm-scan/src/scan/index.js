const {
  logger,
  sleep,
  fetchBlocks,
  chainHeight: { getLatestFinalizedHeight },
  store: { getAddresses, clearAddresses },
  scan: {
    utils: { getTargetHeight, getHeights, checkAndUpdateSpecs },
  },
} = require("@statescan/common");
const { getNextScanHeight, updateScanHeight } = require("../mongo/scanHeight");
const last = require("lodash.last");
const { deleteFromHeight } = require("../mongo/service");
const { updateAddrs } = require("../mongo/account");
const { scanBlock } = require("./block");

async function beginScan() {
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
    // TODO: do following operations in one transaction
    try {
      await scanBlock(item.block, item.events);
      await updateScanHeight(item.height);

      const addrs = getAddresses(item.height);
      await updateAddrs(addrs);
      clearAddresses(item.height);
      if (addrs.length > 0) {
        logger.info(`${addrs.length} addr updated at ${item.height}`);
      }
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
