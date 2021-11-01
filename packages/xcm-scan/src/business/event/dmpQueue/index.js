const { findRegistry } = require("../../../chain/specs");

async function handleDmpQueueEvent(event, indexer, blockEvents, extrinsic) {
  const { section, method } = event;
  if ("dmpQueue" !== section || "ExecutedDownward" !== method) {
    return;
  }

  await handleDownwardMsg(extrinsic.method, indexer);
}

async function handleDownwardMsg(call, indexer) {
  const {
    section,
    method,
    args: [{ downwardMessages } = {}],
  } = call;
  if ("parachainSystem" !== section || "setValidationData" !== method) {
    // todo: log it
    return;
  }

  if (!downwardMessages || !Array.isArray(downwardMessages)) {
    // todo: log it
    return;
  }

  const registry = await findRegistry(indexer.blockHeight);
  for (const downwardMsg of downwardMessages) {
    await handleOneMsg(downwardMsg, indexer, registry);
  }
}

async function handleOneMsg(msg, indexer, registry) {
  let versionedXcm;
  try {
    versionedXcm = registry.createType("VersionedXcm", msg, false);
  } catch (e) {
    console.log(`versionedXcm parse failed at ${indexer.blockHeight}`);
    return null;
  }

  console.log(versionedXcm);
}

module.exports = {
  handleDmpQueueEvent,
};
