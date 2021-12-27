const omit = require("lodash.omit");
const { extractBlockTime } = require("@statescan/common");

function normalizeBlock({ block, events, author }) {
  const hash = block.hash.toHex();
  const blockJson = block.toJSON();
  const authorJson = author?.toJSON();
  const blockTime = extractBlockTime(block.extrinsics);

  return {
    hash,
    blockTime,
    author: authorJson,
    eventsCount: (events || []).length,
    extrinsicsCount: (block.extrinsics || []).length,
    ...omit(blockJson, ["extrinsics"]),
  };
}

module.exports = {
  normalizeBlock,
};
