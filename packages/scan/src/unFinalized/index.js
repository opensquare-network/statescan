const {
  getLatestFinalizedHeight,
  getLatestUnFinalizedHeight,
} = require("../chain");
const { getApi } = require("../api");
const { extractAuthor } = require("@polkadot/api-derive/type/util");
const extractBlockTime = require("../block/extractBlockTime");
const { getUnFinalizedBlockCollection } = require("../mongo");
const omit = require("lodash.omit");
const { saveBlocksEventData } = require("./events");
const { saveBlocksExtrinsicData } = require("./extrinsics");

let preScanFinalizedHeight = null;
let preScanUnFinalizedHeight = null;

async function updateUnFinalized() {
  const finalizedHeight = getLatestFinalizedHeight();
  const unFinalizedHeight = getLatestUnFinalizedHeight();
  if (
    preScanFinalizedHeight === finalizedHeight &&
    preScanUnFinalizedHeight === unFinalizedHeight
  ) {
    return;
  }

  if (finalizedHeight === unFinalizedHeight) {
    return;
  }

  let heights = [];
  for (let i = finalizedHeight + 1; i <= unFinalizedHeight; i++) {
    heights.push(i);
  }

  if (heights.length <= 0) {
    return;
  }

  const promises = heights.map((height) => getBlockFromNode(height));
  const blockDataArr = await Promise.all(promises);

  const normalizedBlocks = blockDataArr.map(normalizeBlock);
  await saveBlocks(normalizedBlocks);
  await saveBlocksEventData(blockDataArr);
  await saveBlocksExtrinsicData(blockDataArr);

  preScanFinalizedHeight = finalizedHeight;
  preScanUnFinalizedHeight = unFinalizedHeight;
}

async function saveBlocks(normalizedBlocks) {
  const unFinalizedBlockCol = await getUnFinalizedBlockCollection();
  const bulk = unFinalizedBlockCol.initializeOrderedBulkOp();

  bulk.find({}).delete();
  for (const block of normalizedBlocks) {
    bulk.insert(block);
  }

  await bulk.execute();
}

async function getBlockFromNode(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const [block, events, validators] = await Promise.all([
    api.rpc.chain.getBlock(blockHash),
    api.query.system.events.at(blockHash),
    api.query.session.validators.at(blockHash),
  ]);

  const digest = api.registry.createType(
    "Digest",
    block.block.header.digest,
    true
  );
  const author = extractAuthor(digest, validators);

  return {
    block,
    events,
    author,
  };
}

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
  updateUnFinalized,
};
