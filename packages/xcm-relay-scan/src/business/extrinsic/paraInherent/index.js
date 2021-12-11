const { getUpwardMessageCollection } = require("../../../mongo");
const { Modules, busLogger } = require("@statescan/common");
const { blake2AsHex } = require("@polkadot/util-crypto");

async function handleParaInherentExtrinsic(extrinsic, indexer, events) {
  const { section, method } = extrinsic.method;

  if (Modules.ParasInherent !== section || "enter" !== method) {
    return;
  }

  const backedCandidates = extrinsic.method.args[0].backedCandidates;
  for (const { candidate } of backedCandidates) {
    await handleCandidate(candidate, indexer);
  }
}

async function handleCandidate({ descriptor, commitments }, indexer) {
  if (
    descriptor.paraId !== 1000 ||
    (commitments.upwardMessages || []).length <= 0
  ) {
    return;
  }

  const col = await getUpwardMessageCollection();
  const bulk = col.initializeUnorderedBulkOp();
  let index = 0;
  for (const msg of commitments.upwardMessages) {
    const msgId = blake2AsHex(msg);
    const message = msg.toHex();
    bulk.insert({
      msgId,
      message,
      msgIndex: index++,
      descriptor,
      indexer,
    });
  }

  await bulk.execute();
  busLogger.info(
    `found ${commitments.upwardMessages.length} upward messages, at`,
    indexer
  );
}

module.exports = {
  handleParaInherentExtrinsic,
};
