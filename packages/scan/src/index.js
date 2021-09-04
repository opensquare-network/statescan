require("dotenv").config();

const { disconnect } = require("./api");
const { updateHeight, getLatestFinalizedHeight } = require("./chain");
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { sleep } = require("./utils/sleep");
const { getBlocks } = require("./mongo/meta");
const { GenericBlock } = require("@polkadot/types");
const { extractBlock } = require("./block");
const { getBlockIndexer } = require("./block/getBlockIndexer");
const { handleExtrinsics } = require("./extrinsic");
const { handleEvents } = require("./event");
const { logger } = require("./logger");
const asyncLocalStorage = require("./asynclocalstorage");
const { withSession } = require("./mongo");
const last = require("lodash.last");
const { initDb } = require("./mongo");
const { getApi } = require("./api");
const { setSpecHeights } = require("./specs");
const { normalizeEvents } = require("./utils/normalize/event");
const { normalizeExtrinsics } = require("./utils/normalize/extrinsic");
const { saveData } = require("./service");
const { makeAssetStatistics } = require("./statistic");
const {
  setLastBlockIndexer,
  getLastBlockIndexer,
  isNewDay,
} = require("./statistic/date");
const { clearAddresses } = require("./store/blockAddresses");
const { updateSpecs, getSpecHeights, findRegistry } = require("./specs");
const { getAddresses } = require("./store/blockAddresses");
const { handleMultiAddress } = require("./utils/updateOrCreateAddress");
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
    registry,
    block,
    blockEvents,
    blockInDb.author,
    blockIndexer,
    session
  );
}

async function scanNormalizedBlock(
  registry,
  block,
  blockEvents,
  author,
  blockIndexer,
  session
) {
  const extractedBlock = extractBlock(block, blockEvents, author);
  const extractedExtrinsics = normalizeExtrinsics(
    block.extrinsics,
    blockEvents,
    blockIndexer
  );
  const extractedEvents = normalizeEvents(
    blockEvents,
    blockIndexer,
    block.extrinsics
  );
  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
  await handleEvents(blockEvents, blockIndexer, block.extrinsics);

  await handleMultiAddress(
    blockIndexer,
    getAddresses(blockIndexer.blockHeight),
    registry
  );
  clearAddresses(blockIndexer.blockHeight);

  await saveData(
    blockIndexer,
    extractedBlock,
    extractedExtrinsics,
    extractedEvents,
    session
  );

  setLastBlockIndexer(blockIndexer);
}

async function test() {
  await initDb();
  const height = 1212;
  setSpecHeights([height]);

  const api = await getApi();
  const registry = await findRegistry(height);
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  const allEvents = await api.query.system.events.at(blockHash);

  const blockIndexer = getBlockIndexer(block.block);

  await withSession(async (session) => {
    session.startTransaction();
    await scanNormalizedBlock(
      registry,
      block.block,
      allEvents,
      "",
      blockIndexer,
      session
    );
    await session.commitTransaction();
  });
}

// test();

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(cleanUp);

async function cleanUp() {
  await disconnect();
}
