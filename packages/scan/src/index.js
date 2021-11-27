require("dotenv").config();

const { disconnect, isApiConnected } = require("@statescan/utils");
const {
  chainHeight: { updateHeight, getLatestFinalizedHeight },
} = require("@statescan/utils");
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { getBlockIndexer } = require("@statescan/utils");
const { logger } = require("./logger");
const asyncLocalStorage = require("./asynclocalstorage");
const { isUseMeta } = require("./env");
const { fetchBlocks } = require("./service/fetchBlocks");
const { initDb, withSession } = require("./mongo");
const { updateAllRawAddrs } = require("./service/updateRawAddress");
const { scanNormalizedBlock } = require("./scan");
const { makeAssetStatistics } = require("./statistic");
const { getLastBlockIndexer, isNewDay } = require("./statistic/date");
const {
  specs: { updateSpecs, getSpecHeights, getMetaScanHeight },
} = require("@statescan/utils");
const { updateUnFinalized } = require("./unFinalized");
const { sleep } = require("@statescan/utils");

const scanStep = parseInt(process.env.SCAN_STEP) || 100;

async function main() {
  await initDb();
  await updateHeight();

  if (isUseMeta()) {
    await updateSpecs();
    const specHeights = getSpecHeights();
    if (specHeights.length <= 0 || specHeights[0] > 1) {
      logger.error("No specHeights or invalid");
      return;
    }
  }

  let scanFinalizedHeight = await getNextScanHeight();
  while (true) {
    await sleep(0);
    // chainHeight is the current on-chain last block height
    const finalizedHeight = getLatestFinalizedHeight();

    if (scanFinalizedHeight >= finalizedHeight) {
      await updateUnFinalized();
    }

    if (scanFinalizedHeight > finalizedHeight) {
      // Just wait if the to scan height greater than current chain height
      await sleep(3000);
      continue;
    }

    let targetHeight = finalizedHeight;
    // Retrieve & Scan no more than 100 blocks at a time
    if (scanFinalizedHeight + scanStep < finalizedHeight) {
      targetHeight = scanFinalizedHeight + scanStep;
    }

    if (targetHeight > getMetaScanHeight()) {
      await updateSpecs();
    }

    const heights = [];
    for (let i = scanFinalizedHeight; i <= targetHeight; i++) {
      heights.push(i);
    }

    const blocks = await fetchBlocks(heights);
    if ((blocks || []).length <= 0) {
      await sleep(1000);
      continue;
    }

    const minHeight = blocks[0].height;
    const maxHeight = blocks[(blocks || []).length - 1].height;
    const updateAddrHeight = finalizedHeight - 100;
    if (minHeight <= updateAddrHeight && maxHeight >= updateAddrHeight) {
      logger.info(`To update accounts at ${updateAddrHeight}`);
      const block = (blocks || []).find((b) => b.height === updateAddrHeight);
      await updateAllRawAddrs(block.block);
      logger.info(`Accounts updated at ${updateAddrHeight}`);
    } else if (maxHeight >= finalizedHeight && maxHeight % 100 === 0) {
      const block = blocks[(blocks || []).length - 1];
      await updateAllRawAddrs(block.block);
    }

    for (const block of blocks) {
      await withSession(async (session) => {
        session.startTransaction();
        try {
          await asyncLocalStorage.run(session, async () => {
            await scanBlock(block, session);
            await updateScanHeight(block.height);
          });

          await session.commitTransaction();
        } catch (e) {
          logger.error(`Error with block scan ${block.height}`, e);
          await session.abortTransaction();
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
      });
    }

    logger.info(`block ${scanFinalizedHeight - 1} done`);
  }
}

async function scanBlock(blockInfo, session) {
  const blockIndexer = getBlockIndexer(blockInfo.block);
  if (isNewDay(blockIndexer.blockTime)) {
    await makeAssetStatistics(getLastBlockIndexer());
  }

  await scanNormalizedBlock(
    blockInfo.block,
    blockInfo.events,
    blockInfo.author,
    blockIndexer,
    session
  );
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(cleanUp);

async function cleanUp() {
  await disconnect();
}
