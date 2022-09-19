require("dotenv").config();
const { getLastBlockIndexer } = require("./statistic/date");
const { makeAssetStatistics } = require("./statistic");
const { isNewDay } = require("./statistic/date");
const { scanNormalizedBlock } = require("./scan");
const {
  getBlockIndexer,
  getApi,
  specs: { setSpecHeights },
} = require("@statescan/common");
const { initDb } = require("./mongo");

async function scanBlock(blockInfo) {
  const blockIndexer = getBlockIndexer(blockInfo.block);
  if (isNewDay(blockIndexer.blockTime)) {
    await makeAssetStatistics(getLastBlockIndexer());
  }

  await scanNormalizedBlock(blockInfo.block, blockInfo.events, blockIndexer);
}

async function test() {
  await initDb();
  const heights = [2869931];
  // const height = 917004;
  await setSpecHeights(heights);

  for (const height of heights) {
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    await scanBlock({
      block: block.block,
      events: allEvents,
    });
  }

  console.log("finished");
}

test();
