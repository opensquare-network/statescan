const { bulkInsertTeleportIns } = require("../../../mongo/service");
const { extractTeleportFromV0Xcm } = require("./xcm/v0");
const {
  Modules,
  DmpQueueEvents,
  ParachainSystemMethods,
  specs: { findRegistry },
  store: { addAddresses },
} = require("@statescan/common");
const { blake2AsHex } = require("@polkadot/util-crypto");

function idToMessage(downwardMessages = []) {
  return downwardMessages.reduce((result, downwardMessage) => {
    const messageId = blake2AsHex(
      downwardMessage.pubMsg || downwardMessage.msg
    );
    result[messageId] = downwardMessage;
    return result;
  }, {});
}

async function handleParachainExtrinsic(extrinsic, indexer, events) {
  const { section, method } = extrinsic.method;

  if (
    Modules.ParachainSystem !== section ||
    ParachainSystemMethods.setValidationData !== method
  ) {
    return;
  }

  const executedDownwardEvents = events.filter(({ section, method }) => {
    return (
      Modules.DmpQueue === section && DmpQueueEvents.ExecutedDownward === method
    );
  });
  if (executedDownwardEvents.length <= 0) {
    return;
  }

  const downwardMessages = extrinsic.method.args[0].get("downwardMessages");
  const idToMsgMap = idToMessage(downwardMessages);

  let teleports = [];
  for (const event of executedDownwardEvents) {
    const messageId = event.data[0].toHex();
    const theDownwardMessage = idToMsgMap[messageId];
    const result = await extractTeleportDownward(
      theDownwardMessage.pubMsg || theDownwardMessage.msg,
      messageId,
      indexer
    );
    if (!result) {
      continue;
    }

    const complete = event.data[1].isComplete;
    teleports.push({
      sentAt: (
        theDownwardMessage.pubSentAt || theDownwardMessage.sentAt
      ).toNumber(),
      messageId,
      ...result,
      complete,
      indexer,
    });
  }

  addAddresses(
    indexer.blockHeight,
    teleports.map((teleport) => teleport.beneficiary)
  );

  await bulkInsertTeleportIns(teleports);
}

async function extractTeleportDownward(pubMsg, messageId, indexer) {
  const registry = await findRegistry(indexer);

  let versionedXcm;
  try {
    versionedXcm = registry.createType("VersionedXcm", pubMsg, true);
  } catch (e) {
    console.log(`versionedXcm parse failed at ${indexer.blockHeight}`, e);
    return null;
  }

  if (versionedXcm.isV0) {
    return await extractTeleportFromV0Xcm(
      versionedXcm.asV0,
      messageId,
      indexer
    );
  }
}

module.exports = {
  handleParachainExtrinsic,
};
