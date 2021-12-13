const dotenv = require("dotenv");
dotenv.config();

const {
  getUpwardMessageCollection,
  getReceivedCollection,
  getExecutedCollection,
} = require("./mongo");
const {
  known: { saveKnownHeights, closeKnownClient },
} = require("@statescan/common");

async function main() {
  const heights = [];

  let col = await getUpwardMessageCollection();
  let arr = await col.find({}).toArray();
  heights.push(...arr.map((t) => t.indexer.blockHeight));

  col = await getReceivedCollection();
  arr = await col.find({}).toArray();
  heights.push(...arr.map((t) => t.indexer.blockHeight));

  await saveKnownHeights(heights);
  heights.splice(0);

  col = await getExecutedCollection();
  arr = await col.find({}).toArray();
  heights.push(...arr.map((t) => t.indexer.blockHeight));

  await saveKnownHeights(heights);
  heights.splice(0);
}

main()
  .then(async () => {
    console.log("Known heights saved");
    await closeKnownClient();
    process.exit(0);
  })
  .catch(console.error);
