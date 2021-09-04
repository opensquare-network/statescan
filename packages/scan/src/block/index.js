const { getBlockCollection } = require("../mongo");
const asyncLocalStorage = require("../asynclocalstorage");
const omit = require("lodash.omit");
const { extractBlockTime } = require("./extractBlockTime");

function extractBlock(block, events, author) {
  const hash = block.hash.toHex();
  const blockJson = block.toJSON();
  const blockTime = extractBlockTime(block.extrinsics);

  return {
    hash,
    blockTime,
    author,
    eventsCount: (events || []).length,
    extrinsicsCount: (block.extrinsics || []).length,
    ...omit(blockJson, ["extrinsics"]),
  };
}

async function handleBlock(block, blockEvents, author) {
  const hash = block.hash.toHex();
  const blockJson = block.toJSON();
  const authorJson = author?.toJSON();
  const blockTime = extractBlockTime(block.extrinsics);

  const session = asyncLocalStorage.getStore();
  const blockCol = await getBlockCollection();
  const result = await blockCol.insertOne(
    {
      hash,
      blockTime,
      author: authorJson,
      eventsCount: (blockEvents || []).length,
      extrinsicsCount: (block.extrinsics || []).length,
      ...omit(blockJson, ["extrinsics"]),
    },
    { session }
  );

  if (result.result && !result.result.ok) {
    // TODO: Handle insertion failed
  }
}

module.exports = {
  handleBlock,
  extractBlock,
};
