const { getReceivedCollection } = require("../../../mongo");

async function handleUpwardMessagesReceived(event, indexer) {
  const [paraId, count, size] = event.data.toJSON();
  if (1000 !== paraId) {
    return;
  }

  const col = await getReceivedCollection();
  await col.insertOne({
    paraId,
    count,
    size,
    indexer,
  });
}

module.exports = {
  handleUpwardMessagesReceived,
};
