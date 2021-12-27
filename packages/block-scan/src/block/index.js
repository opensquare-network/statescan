const omit = require("lodash.omit");
const { extractBlockTime } = require("@statescan/common");

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

module.exports = {
  extractBlock,
};
