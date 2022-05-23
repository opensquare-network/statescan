require("dotenv").config();

const {
  logger,
  sleep,
  disconnect,
  isApiConnected,
  getBlockIndexer,
  chainHeight: { updateHeight, getLatestFinalizedHeight },
  specs: { updateSpecs },
  scan: {
    utils: { getTargetHeight, checkAndUpdateSpecs, getHeights },
  },
} = require("@statescan/common");
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { fetchBlocks } = require("@statescan/common");
const { initDb } = require("./mongo");
const { scanNormalizedBlock } = require("./scan");
const { updateUnFinalized } = require("./unFinalized");
const { deleteFromHeight } = require("./delete");

async function main() {
  await initDb();
  await updateHeight();
  await updateSpecs();

  let scanFinalizedHeight = await getNextScanHeight();

  await deleteFromHeight(scanFinalizedHeight);

  while (true) {
    await sleep(0);
    // chainHeight is the current on-chain last block height
    const finalizedHeight = getLatestFinalizedHeight();

    // if (scanFinalizedHeight >= finalizedHeight) {
    //   await updateUnFinalized();
    // }

    if (scanFinalizedHeight > finalizedHeight) {
      // Just wait if the to scan height greater than current chain height
      await sleep(3000);
      continue;
    }

    const targetHeight = getTargetHeight(scanFinalizedHeight);
    await checkAndUpdateSpecs(targetHeight);
    const heights = getHeights(scanFinalizedHeight, targetHeight);

    const blocks = await fetchBlocks(heights, true);
    if ((blocks || []).length <= 0) {
      await sleep(1000);
      continue;
    }

    for (const block of blocks) {
      try {
        await scanBlock(block);
        await updateScanHeight(block.height);
      } catch (e) {
        logger.error(`Error with block scan ${block.height}`, e);
        await sleep(3000);

        if (!isApiConnected()) {
          console.log(`provider disconnected, will restart`);
          process.exit(0);
        }
      }

      scanFinalizedHeight = block.height + 1;

      if (block.height % 100000 === 0) {
        process.exit(0);
      }
    }

    logger.info(`block ${scanFinalizedHeight - 1} done`);
  }
}

async function scanBlock(blockInfo) {
  const blockIndexer = getBlockIndexer(blockInfo.block);

  await scanNormalizedBlock(
    blockInfo.block,
    blockInfo.events,
    blockInfo.author,
    blockIndexer
  );
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(cleanUp);

async function cleanUp() {
  await disconnect();
}
