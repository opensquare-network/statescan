require("dotenv").config();

const { disconnect } = require("./api");
const { updateHeight, getLatestFinalizedHeight } = require("./chain");
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { sleep } = require("./utils/sleep");
const { getBlocks } = require("./mongo/meta");
const { GenericBlock } = require("@polkadot/types");
const { getBlockIndexer } = require("./block/getBlockIndexer");
const { logger } = require("./logger");
const asyncLocalStorage = require("./asynclocalstorage");
const { withSession } = require("./mongo");
const last = require("lodash.last");
const { updateAllRawAddrs } = require("./service/updateRawAddress");
const { scanNormalizedBlock } = require("./scan");
const { makeAssetStatistics } = require("./statistic");
const { getLastBlockIndexer, isNewDay } = require("./statistic/date");
const { updateSpecs, getSpecHeights, findRegistry } = require("./specs");
const { updateUnFinalized } = require("./unFinalized");

const scanStep = parseInt(process.env.SCAN_STEP) || 100;

async function main() {
  await updateHeight();
  await updateSpecs();
  const specHeights = getSpecHeights();
  if (specHeights.length <= 0 || specHeights[0] > 1) {
    logger.error("No specHeights or invalid");
    return;
  }

  let scanFinalizedHeight = await getNextScanHeight();
  while (true) {
    await sleep(0);
    // chainHeight is the current on-chain last block height
    const finalizedHeight = getLatestFinalizedHeight();

    if (scanFinalizedHeight > finalizedHeight) {
      // Just wait if the to scan height greater than current chain height
      await updateUnFinalized();
      await sleep(3000);
      continue;
    }

    let targetHeight = finalizedHeight;
    // Retrieve & Scan no more than 100 blocks at a time
    if (scanFinalizedHeight + scanStep < finalizedHeight) {
      targetHeight = scanFinalizedHeight + scanStep;
    }

    const specHeights = getSpecHeights();
    if (targetHeight > last(specHeights)) {
      await updateSpecs();
    }

    const blocks = await getBlocks(scanFinalizedHeight, targetHeight);
    if ((blocks || []).length <= 0) {
      await sleep(1000);
      continue;
    }

    if (blocks[0].height + 100 > finalizedHeight) {
      await updateAllRawAddrs(blocks[0]);
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
        }

        scanFinalizedHeight = block.height + 1;
      });
    }

    logger.info(`block ${scanFinalizedHeight - 1} done`);
  }
}

async function scanBlock(blockInDb, session) {
  const registry = await findRegistry(blockInDb.height);
  const block = new GenericBlock(registry, blockInDb.block.block);

  const blockEvents = registry.createType(
    "Vec<EventRecord>",
    blockInDb.events,
    true
  );

  const blockIndexer = getBlockIndexer(block);
  if (isNewDay(blockIndexer.blockTime)) {
    await makeAssetStatistics(getLastBlockIndexer());
  }

  await scanNormalizedBlock(
    block,
    blockEvents,
    blockInDb.author,
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
