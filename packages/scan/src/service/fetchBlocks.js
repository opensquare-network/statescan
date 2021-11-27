const { blockLogger } = require("../logger");
const { isUseMeta } = require("../env");
const { findRegistry } = require("../specs");
const { getBlocksByHeights } = require("../mongo/meta");
const { findBlockApi } = require("../spec/blockApi");
const { getApi } = require("../api");
const { extractAuthor } = require("@polkadot/api-derive/type/util");
const { GenericBlock } = require("@polkadot/types");

async function fetchBlocks(heights = []) {
  let blocks;
  if (isUseMeta()) {
    blocks = await fetchBlocksFromDb(heights);
  } else {
    blocks = await fetchBlocksFromNode(heights);
  }
  return blocks.filter((b) => b !== null);
}

async function constructBlockFromDbData(blockInDb) {
  const registry = await findRegistry({
    blockHeight: blockInDb.height,
    blockHash: blockInDb.blockHash,
  });
  const block = new GenericBlock(registry, blockInDb.block.block);
  const allEvents = registry.createType(
    "Vec<EventRecord>",
    blockInDb.events,
    true
  );

  return {
    height: blockInDb.height,
    block,
    events: allEvents,
    author: blockInDb.author,
  };
}

async function fetchBlocksFromDb(heights = []) {
  const blocksInDb = await getBlocksByHeights(heights);

  const blocks = [];
  for (const blockInDb of blocksInDb) {
    let block;
    try {
      block = await constructBlockFromDbData(blockInDb);
    } catch (e) {
      blockLogger.error(
        `can not construct block from db data at ${blockInDb.height}`,
        e
      );
      console.log(
        `can not construct block from db data at ${blockInDb.height}`
      );
      block = await makeSureFetch(blockInDb.height);
      blockLogger.error(`but fetched from node at ${blockInDb.height}`);
    }

    blocks.push(block);
  }

  return blocks;
}

async function fetchBlocksFromNode(heights = []) {
  const allPromises = [];
  for (const height of heights) {
    allPromises.push(makeSureFetch(height));
  }

  return await Promise.all(allPromises);
}

async function makeSureFetch(height) {
  try {
    return await fetchOneBlockFromNode(height);
  } catch (e) {
    blockLogger.error(`error fetch block ${height}`, e);
    return null;
  }
}

async function fetchOneBlockFromNode(height) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const blockApi = await findBlockApi(blockHash);

  const promises = [
    api.rpc.chain.getBlock(blockHash),
    blockApi.query.system.events(),
  ];

  if (blockApi.query.session?.validators) {
    promises.push(blockApi.query.session.validators());
  }

  const [block, events, validators] = await Promise.all(promises);

  let author = null;
  if (validators) {
    const digest = api.registry.createType(
      "Digest",
      block.block.header.digest,
      true
    );

    author = extractAuthor(digest, validators);
  }

  return {
    height,
    block: block.block,
    events,
    author: author ? author.toString() : author,
  };
}

module.exports = {
  fetchBlocks,
  fetchOneBlockFromNode,
};
