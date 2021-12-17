const { handleTeleportExtrinsic } = require("./teleport");
const { Modules } = require("@statescan/common");

async function handlePolkadotXcmExtrinsic(extrinsic, indexer, events) {
  const { section } = extrinsic.method;

  if (Modules.PolkadotXcm !== section) {
    return;
  }

  await handleTeleportExtrinsic(extrinsic, indexer, events);
}

module.exports = {
  handlePolkadotXcmExtrinsic,
};
