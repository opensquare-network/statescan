const { findBlockApi } = require("../blockApi");
const { getApi } = require("../api");
const { blockLogger } = require("../logger");
const { getBlocksByHeights } = require("../mongo/meta");
const { findRegistry } = require("./specs");
const { isUseMeta } = require("../env");
const { extractAuthor } = require("@polkadot/api-derive/type/util");
const { GenericBlock } = require("@polkadot/types");

async function fetchBlocks(heights = [], doFetchAuthor = false) {
  let blocks;
  if (isUseMeta()) {
    blocks = await fetchBlocksFromDb(heights, doFetchAuthor);
  } else {
    blocks = await fetchBlocksFromNode(heights, doFetchAuthor);
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

async function fetchBlocksFromDb(heights = [], doFetchAuthor = false) {
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
      block = await makeSureFetch(blockInDb.height, doFetchAuthor);
      blockLogger.error(`but fetched from node at ${blockInDb.height}`);
    }

    blocks.push(block);
  }

  return blocks;
}

async function fetchBlocksFromNode(heights = [], doFetchAuthor = false) {
  const allPromises = [];
  for (const height of heights) {
    allPromises.push(makeSureFetch(height, doFetchAuthor));
  }

  return await Promise.all(allPromises);
}

async function makeSureFetch(height, doFetchAuthor = false) {
  try {
    return await fetchOneBlockFromNode(height, doFetchAuthor);
  } catch (e) {
    blockLogger.error(`error fetch block ${height}`, e);
    return null;
  }
}

async function fetchOneBlockFromNode(height, doFetchAuthor = false) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const blockApi = await findBlockApi(blockHash);

  const promises = [
    api.rpc.chain.getBlock(blockHash),
    blockApi.query.system.events(),
  ];

  if (blockApi.query.session?.validators && doFetchAuthor) {
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

  const result = {
    height,
    block: block.block,
    events,
  };

  if (doFetchAuthor && author) {
    return {
      ...result,
      author: author.toString(),
    };
  } else {
    return result;
  }
}

module.exports = {
  fetchBlocks,
  fetchOneBlockFromNode,
};
