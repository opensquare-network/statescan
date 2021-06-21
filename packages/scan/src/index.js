const { getApi, disconnect } = require("./api");
const { updateHeight, getLatestHeight } = require("./chain");
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight");
const { sleep } = require("./utils/sleep");
const { handleBlock } = require("./block");
const { getBlockIndexer } = require("./block/getBlockIndexer");
const { handleExtrinsics } = require("./extrinsic");
const { handleEvents } = require("./event");
const { logger } = require("./logger");
const { CHAINS } = require("./envvars");

async function main() {
  await updateHeight();

  let scanHeight = await getNextScanHeight();
  while (true) {
    const chainHeight = getLatestHeight();

    if (scanHeight > chainHeight) {
      // Just wait if the to scan height greater than current chain height
      await sleep(1000);
      continue;
    }

    await scanBlockByHeight(scanHeight);
    await updateScanHeight(scanHeight++);
  }
}

async function test() {
  const knownHeights =
    process.env.CHAIN === CHAINS.STATEMINT
      ? [202, 241, 247, 254, 294, 306, 317, 488, 1488, 1502, 1658, 1663]
      : process.env.CHAIN === CHAINS.WESTMINT
      ? [
          1221, 1225, 6316, 6425, 6427, 6435, 6450, 6507, 6543, 6669, 6671,
          18819, 18847, 18999, 19283, 19403, 19884, 34539, 34543, 36120, 38270,
          47362, 57420, 57775, 57781, 61264, 61268, 61375, 61416, 61479, 61703,
          61711, 61715, 61724, 61811, 61817, 61826, 70108, 70113, 70122, 70134,
        ]
      : [];
  for (const height of knownHeights) {
    await scanBlockByHeight(height);
  }
}

async function scanBlockByHeight(scanHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(scanHeight);
  const block = await api.rpc.chain.getBlock(blockHash);
  const blockEvents = await api.query.system.events.at(blockHash);

  await handleBlock(block.block, blockEvents);
  const blockIndexer = getBlockIndexer(block.block);
  await handleExtrinsics(block.block.extrinsics, blockEvents, blockIndexer);
  await handleEvents(blockEvents, blockIndexer, block.block.extrinsics);
  logger.info(`block ${block.block.header.number.toNumber()} done`);
}

test()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(cleanUp);

async function cleanUp() {
  await disconnect();
}
