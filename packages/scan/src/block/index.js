const extractBlockTime = require("./extractBlockTime");
const { getBlockCollection } = require("../mongo");
const asyncLocalStorage = require("../asynclocalstorage");

async function handleBlock(block, blockEvents, author) {
  const hash = block.hash.toHex();
  const blockJson = block.toJSON();
  const authorJson = author?.toJSON();
  const blockTime = extractBlockTime(block.extrinsics);

  const session = asyncLocalStorage.getStore();
  const blockCol = await getBlockCollection();
  const result = await blockCol.insertOne({
    hash,
    blockTime,
    author: authorJson,
    eventsCount: (blockEvents || []).length,
    extrinsicsCount: (block.extrinsics || []).length,
    ...blockJson,
  }, { session });

  if (result.result && !result.result.ok) {
    // TODO: Handle insertion failed
  }
}

module.exports = {
  handleBlock,
};
