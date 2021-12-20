const {
  getUpwardMessageCollection,
  getExecutedCollection,
  getReceivedCollection,
} = require(".");
const { getTeleportOutCollection } = require("./parachain");

async function deleteFromHeight(height) {
  let col = await getUpwardMessageCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: height } });

  col = await getExecutedCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: height } });

  col = await getReceivedCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: height } });
}

async function updateTeleportOutInfo(messageId, indexer, outcome) {
  const teleportOutCol = await getTeleportOutCollection();
  const upwardMessageCol = await getUpwardMessageCollection();
  const upwardMessage = await upwardMessageCol.findOne(
    {
      msgId: messageId,
      "indexer.blockHeight": { $lte: indexer.blockHeight },
    },
    { sort: { "indexer.blockHeight": -1 } }
  );

  if (!upwardMessage) {
    return;
  }

  const blockHash = upwardMessage.descriptor.paraHead;
  const beneficiary = upwardMessage.extracted?.beneficiary;
  const amount = upwardMessage.extracted?.amount;
  const teleportOut = await teleportOutCol.findOne({
    "indexer.blockHash": blockHash,
    beneficiary,
    amount,
  });

  if (!teleportOut) {
    return;
  }

  await teleportOutCol.updateOne(
    { _id: teleportOut._id },
    {
      $set: {
        relayChainInfo: {
          enterAt: upwardMessage.indexer,
          executedAt: indexer,
          outcome,
          fee: upwardMessage.extracted?.fee,
        },
      },
    }
  );
}

module.exports = {
  deleteFromHeight,
  updateTeleportOutInfo,
};
