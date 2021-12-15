const { getExecutedCollection, getUpwardMessageCollection } = require("../../../mongo");
const { getTeleportOutCollection } = require("../../../mongo/parachain");

async function handleExecutedUpward(event, indexer) {
  const [messageId, outcome] = event.data.toJSON();

  const col = await getExecutedCollection();
  await col.insertOne({
    messageId,
    outcome,
    indexer,
  });

  const teleportOutCol = await getTeleportOutCollection();
  const upwardMessageCol = await getUpwardMessageCollection();
  const upwardMessage = await upwardMessageCol.findOne({ msgId: messageId });
  if (upwardMessage) {
    const blockHash = upwardMessage.descriptor.paraHead;
    const teleportOut = await teleportOutCol.findOne({ "indexer.blockHash": blockHash });
    if (teleportOut) {
      await teleportOutCol.updateOne(
        { _id: teleportOut._id },
        {
          $set: {
            relayChainInfo: {
              enterAt:  upwardMessage.indexer,
              executedAt: indexer,
              outcome,
            }
          }
        }
      );
    }
  }
}

module.exports = {
  handleExecutedUpward,
};
