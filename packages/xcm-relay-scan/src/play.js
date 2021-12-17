require("dotenv").config();

const { scanBlock } = require("./scan/block");
const {
  getApi,
  specs: { setSpecHeights },
} = require("@statescan/common");
const { initDb } = require("./mongo");

async function test() {
  await initDb();
  // const heights = [7515704];
  // const heights = [7519683];
  const heights = [7812531];
  // const heights = [7812703];
  // const heights = [8921808];

  await setSpecHeights(heights);

  for (const height of heights) {
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    // const has = block.block.extrinsics
    //   .map((x) => x.method.section)
    //   .includes("paraInherent");
    // console.log(has);
    // console.log(block);
    await scanBlock(block.block, allEvents);
  }

  console.log("finished");
}

test();
