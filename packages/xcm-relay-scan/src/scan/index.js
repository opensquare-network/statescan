const {
  logger,
  sleep,
  fetchBlocks,
  env: { currentChain, firstScanKnowHeights },
  chainHeight: { getLatestFinalizedHeight },
  specs: { updateSpecs },
  mem: { exitWhenTooMuchMem },
  clearBlockApi,
  scan: {
    utils: { getTargetHeight, getHeights, checkAndUpdateSpecs },
  },
} = require("@statescan/common");
const { deleteFromHeight } = require("../mongo/service");
const { getNextScanHeight, updateScanHeight } = require("../mongo/scanHeight");
const last = require("lodash.last");
const { scanKnownHeights } = require("./known");
const { scanBlock } = require("./block");

async function getScanHeight() {
  const chain = currentChain();
  const startHeight =
    chain === "kusama" ? 7468793 : chain === "polkadot" ? 7229127 : 1;
  let scanHeight = await getNextScanHeight();
  return Math.max(scanHeight, startHeight);
}

async function beginScan() {
  await updateSpecs();

  if (firstScanKnowHeights()) {
    await scanKnownHeights();
  }

  let scanHeight = await getScanHeight();

  await deleteFromHeight(scanHeight);
  while (true) {
    scanHeight = await oneStepScan(scanHeight);
    await sleep(0);
    clearBlockApi();
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
      await scanBlock(item.block, item.events);
      await updateScanHeight(item.height);
    } catch (e) {
      await sleep(1000);
      logger.error(`Error with block scan ${item.height}`, e);
    } finally {
      exitWhenTooMuchMem();
    }
  }

  const lastHeight = last(blocks || []).height;
  logger.info(`${startHeight} - ${lastHeight} done!`);
  return lastHeight + 1;
}

module.exports = {
  beginScan,
};
