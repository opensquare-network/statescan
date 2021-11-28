require("dotenv").config();

const { scanNormalizedBlock } = require("../scan");
const {
  getBlockIndexer,
  getApi,
  specs: { setSpecHeights },
} = require("@statescan/common");
const { initDb, withSession } = require("../mongo");

async function test() {
  await initDb();
  const height = 1062098;
  // const height = 917004;
  await setSpecHeights([height]);

  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  const allEvents = await api.query.system.events.at(blockHash);

  const blockIndexer = getBlockIndexer(block.block);

  await withSession(async (session) => {
    session.startTransaction();
    await scanNormalizedBlock(
      block.block,
      allEvents,
      "",
      blockIndexer,
      session
    );
    await session.commitTransaction();
  });
}

test();
