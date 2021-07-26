require("dotenv").config();

const { getApi, disconnect } = require("./api");
const { handleBlock } = require("./block");
const { getBlockIndexer } = require("./block/getBlockIndexer");
const { handleExtrinsics } = require("./extrinsic");
const { handleEvents } = require("./event");
const { logger } = require("./logger");
const { CHAINS } = require("./envvars");

async function test() {
  const testBlocks = process.env.CHAIN === CHAINS.WESTMINT
    ? [109591]
    : process.env.CHAIN === CHAINS.STATEMINE
    ? [276700, 276830, 288674, 288686]
    : [];

  for (const scanHeight of testBlocks) {
    await scanBlockByHeight(scanHeight);
  }
}

async function scanBlockByHeight(scanHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(scanHeight);
  console.log(scanHeight, '->', blockHash.toJSON());
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
