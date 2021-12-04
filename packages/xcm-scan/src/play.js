require("dotenv").config();

const { scanBlock } = require("./scan/block");
const {
  getApi,
  specs: { setSpecHeights },
} = require("@statescan/common");
const { initDb } = require("./mongo");

async function test() {
  await initDb();
  const heights = [955529];
  await setSpecHeights(heights);

  for (const height of heights) {
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    await scanBlock(block.block, allEvents);
  }

  console.log("finished");
}

test();
