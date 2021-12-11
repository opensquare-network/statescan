require("dotenv").config();

const { scanBlock } = require("./scan/block");
const { getApi } = require("@statescan/common");
const { initDb } = require("./mongo");

async function test() {
  await initDb();
  const heights = [10469466];

  for (const height of heights) {
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    // const has = block.block.extrinsics
    //   .map((x) => x.method.section)
    //   .includes("parasInherent");
    // console.log(has);
    // console.log(block);
    await scanBlock(block.block, allEvents);
  }

  console.log("finished");
}

test();
