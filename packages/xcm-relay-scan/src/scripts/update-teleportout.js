const dotenv = require("dotenv");
dotenv.config();

const { getExecutedCollection } = require("../mongo");
const { updateTeleportOutInfo } = require("../mongo/service");

async function main() {
  const col = await getExecutedCollection();
  let lastId = null;
  while (true) {
    const allExecuteds = await col
      .find(
        lastId
        ? {
            _id: {
              $gt: lastId
            }
          }
        : {}
      )
      .limit(100)
      .sort({ _id: 1 })
      .toArray();

    if (allExecuteds.length === 0) {
      break;
    }

    for (const executed of allExecuteds) {
      const { messageId, indexer, outcome } = executed;
      console.log(`Updating ${messageId}:`, outcome);
      await updateTeleportOutInfo(messageId, indexer, outcome);
    }

    lastId = allExecuteds[allExecuteds.length - 1]._id;
  }
}

main()
  .catch(console.error)
  .then(() => process.exit(0));
