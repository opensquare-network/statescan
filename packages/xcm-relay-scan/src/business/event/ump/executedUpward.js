const { getExecutedCollection } = require("../../../mongo");

async function handleExecutedUpward(event, indexer) {
  const [messageId, outcome] = event.data.toJSON();

  const col = await getExecutedCollection();
  await col.insertOne({
    messageId,
    outcome,
    indexer,
  });
}

module.exports = {
  handleExecutedUpward,
};
