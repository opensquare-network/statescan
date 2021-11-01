require("dotenv").config();
const { setSpecHeights } = require("./chain/specs");
const { scanBlock } = require("./scan/block");
const { getApi } = require("./api");
const { initDb } = require("./mongo");

async function test() {
  await initDb();
  const height = 1070850;

  setSpecHeights([height]);

  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  const allEvents = await api.query.system.events.at(blockHash);

  await scanBlock(block.block, allEvents);
}

test();
