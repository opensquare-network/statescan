const dotenv = require("dotenv");
dotenv.config();

const { getExecutedCollection } = require("../mongo");
const { updateTeleportOutInfo } = require("../mongo/service");

async function main() {
  const col = await getExecutedCollection();
  const allExecuteds = await col.find({}).toArray();
  for (const executed of allExecuteds) {
    const { messageId, indexer, outcome } = executed;
    console.log(`Updating ${messageId}:`, outcome);
    await updateTeleportOutInfo(messageId, indexer, outcome);
  }
}

main()
  .catch(console.error)
  .then(() => process.exit(0));
