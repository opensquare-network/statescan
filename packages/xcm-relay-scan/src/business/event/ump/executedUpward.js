const { getExecutedCollection } = require("../../../mongo");
const { updateTeleportOutInfo } = require("../../../mongo/service");

async function handleExecutedUpward(event, indexer) {
  const [messageId, outcome] = event.data.toJSON();

  const col = await getExecutedCollection();
  await col.insertOne({
    messageId,
    outcome,
    indexer,
  });

  await updateTeleportOutInfo(messageId, indexer, outcome);
}

module.exports = {
  handleExecutedUpward,
};
