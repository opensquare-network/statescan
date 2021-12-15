const { getUpwardMessageCollection } = require(".");
const { getTeleportOutCollection } = require("./parachain");

async function deleteFromHeight(height) {
  // todo: delete over scaned business
}

async function updateTeleportOutInfo(messageId, indexer, outcome) {
  const teleportOutCol = await getTeleportOutCollection();
  const upwardMessageCol = await getUpwardMessageCollection();
  const upwardMessage = await upwardMessageCol.findOne(
    {
      msgId: messageId,
      "indexer.blockHeight": { $lte: indexer.blockHeight },
      isExecuted: null,
    },
    { sort: { "indexer.blockHeight": 1 } },
  );

  if (!upwardMessage) {
    return;
  }

  await upwardMessageCol.updateOne(
    { _id: upwardMessage._id },
    { $set: { isExecuted: true } }
  );

  const blockHash = upwardMessage.descriptor.paraHead;
  const beneficiary = upwardMessage.extracted.beneficiary;
  const amount = upwardMessage.extracted.amount;
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
          fee: upwardMessage.extracted.fee,
        }
      }
    }
  );
}

module.exports = {
  deleteFromHeight,
  updateTeleportOutInfo,
};
