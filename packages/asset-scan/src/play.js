require("dotenv").config();

const { scanNormalizedBlock } = require("./scan");
const {
  getBlockIndexer,
  getApi,
  specs: { setSpecHeights },
} = require("@statescan/common");
const { initDb } = require("./mongo");

async function test() {
  await initDb();
  const height = 759406;
  // const height = 917004;
  await setSpecHeights([height]);

  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  const allEvents = await api.query.system.events.at(blockHash);

  const blockIndexer = getBlockIndexer(block.block);

  await scanNormalizedBlock(block.block, allEvents, blockIndexer);
  console.log("finished");
}

test();
