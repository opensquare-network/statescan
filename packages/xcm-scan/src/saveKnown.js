const dotenv = require("dotenv");
dotenv.config();

const {
  getTeleportInCollection,
  getTeleportOutCollection,
} = require("./mongo");
const {
  known: { saveKnownHeights, closeKnownClient },
} = require("@statescan/common");

async function main() {
  const heights = [];
  let heightSet, col, arr;

  col = await getTeleportInCollection();
  arr = await col.find({}).toArray();
  heights.push(...arr.map((t) => t.indexer.blockHeight));
  heightSet = new Set(heights);
  await saveKnownHeights([...heightSet]);
  heights.splice(0);

  col = await getTeleportOutCollection();
  arr = await col.find({}).toArray();
  heights.push(...arr.map((t) => t.indexer.blockHeight));
  heightSet = new Set(heights);
  await saveKnownHeights([...heightSet]);
  heights.splice(0);
}

main()
  .then(async () => {
    console.log("Known heights saved");
    await closeKnownClient();
    process.exit(0);
  })
  .catch(console.error);
