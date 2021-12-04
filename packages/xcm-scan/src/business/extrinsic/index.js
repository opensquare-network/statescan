const { handlePolkadotXcmExtrinsic } = require("./polkadotXcm");
const { handleParachainExtrinsic } = require("./parachainSystem");
const {
  utils: { extractExtrinsicEvents },
} = require("@statescan/common");

async function handleExtrinsics(
  extrinsics = [],
  blockEvents = [],
  blockIndexer
) {
  let index = 0;
  for (const extrinsic of extrinsics) {
    const eventRecords = extractExtrinsicEvents(blockEvents, index);
    const events = eventRecords.map((record) => record.event);

    const extrinsicIndexer = {
      ...blockIndexer,
      index: index++,
    };

    await handleParachainExtrinsic(extrinsic, extrinsicIndexer, events);
    await handlePolkadotXcmExtrinsic(extrinsic, extrinsicIndexer, events);
  }
}

module.exports = {
  handleExtrinsics,
};
