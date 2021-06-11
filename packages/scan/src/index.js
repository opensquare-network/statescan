const { getApi, disconnect } = require('./api')
const { updateHeight, getLatestHeight } = require('./chain')
const { getNextScanHeight, updateScanHeight } = require("./mongo/scanHeight")
const { sleep } = require("./utils/sleep")
const { handleBlock } = require("./block")
const { getBlockIndexer } = require("./block/getBlockIndexer")
const { handleExtrinsics } = require("./extrinsic")
const { handleEvents } = require("./event")
const { logger } = require("./logger")

async function main() {
  await updateHeight()

  let scanHeight = await getNextScanHeight()
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
  const knownHeights = [
    202,
    241,
    247,
    254,
    294,
    306,
    317,
    488,
    1488,
    1502,
    1658,
    1663,
  ];
  for (const height of knownHeights) {
    await scanBlockByHeight(height);
  }
}

async function scanBlockByHeight(scanHeight) {
  const api = await getApi()
  const blockHash = await api.rpc.chain.getBlockHash(scanHeight)
  const block = await api.rpc.chain.getBlock(blockHash)
  const blockEvents = await api.query.system.events.at(blockHash)

  await handleBlock(block.block, blockEvents)
  const blockIndexer = getBlockIndexer(block.block)
  await handleExtrinsics(block.block.extrinsics, blockEvents, blockIndexer)
  await handleEvents(blockEvents, blockIndexer, block.block.extrinsics)
  logger.info(`block ${block.block.header.number.toNumber()} done`);
}

main().then(() => console.log('Scan finished'))
  .catch(console.error)
  .finally(cleanUp)

async function cleanUp() {
  await disconnect()
}

