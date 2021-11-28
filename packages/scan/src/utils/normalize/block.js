const omit = require("lodash.omit");
const { extractBlockTime } = require("@statescan/common");

function normalizeBlock({ block, events, author }) {
  const hash = block.block.hash.toHex();
  const blockJson = block.block.toJSON();
  const authorJson = author?.toJSON();
  const blockTime = extractBlockTime(block.block.extrinsics);

  return {
    hash,
    blockTime,
    author: authorJson,
    eventsCount: (events || []).length,
    extrinsicsCount: (block.block.extrinsics || []).length,
    ...omit(blockJson, ["extrinsics"]),
  };
}

module.exports = {
  normalizeBlock,
};
