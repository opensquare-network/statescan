require("dotenv").config();

const { disconnect } = require("./api");
const { updateHeight, getLatestFinalizedHeight } = require("./chain");
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { sleep } = require("./utils/sleep");
const { getBlocks } = require("./mongo/meta");
const { GenericBlock } = require("@polkadot/types");
const { handleBlock } = require("./block");
const { getBlockIndexer } = require("./block/getBlockIndexer");
const { handleExtrinsics } = require("./extrinsic");
const { handleEvents } = require("./event");
const { logger } = require("./logger");
const asyncLocalStorage = require("./asynclocalstorage");
const { withSession } = require("./mongo");
const last = require("lodash.last");
const { clearAddresses } = require("./utils/blockAddresses");
const {
  updateSpecs,
  getSpecHeights,
  findRegistry,
} = require("./mongo/service/specs");
const { getAddresses } = require("./utils/blockAddresses");
const { handleMultiAddress } = require("./utils/updateOrCreateAddress");
const { updateUnFinalized } = require("./unFinalized");

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
    if (scanFinalizedHeight + 100 < finalizedHeight) {
      targetHeight = scanFinalizedHeight + 100;
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

    for (const block of blocks) {
      await withSession(async (session) => {
        session.startTransaction();
        try {
          await asyncLocalStorage.run(session, async () => {
            await scanBlock(block);
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

async function scanBlock(blockInDb) {
  const registry = await findRegistry(blockInDb.height);
  const block = new GenericBlock(registry, blockInDb.block.block);

  const blockEvents = registry.createType(
    "Vec<EventRecord>",
    blockInDb.events,
    true
  );
  const author =
    blockInDb.author &&
    registry.createType("AccountId", blockInDb.author, true);

  await handleBlock(block, blockEvents, author);
  const blockIndexer = getBlockIndexer(block);
  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
  await handleEvents(blockEvents, blockIndexer, block.extrinsics);

  await handleMultiAddress(
    blockIndexer,
    getAddresses(blockInDb.height),
    registry
  );
  clearAddresses(blockInDb.height);
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(cleanUp);

async function cleanUp() {
  await disconnect();
}
