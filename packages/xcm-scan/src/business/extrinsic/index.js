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
  let extrinsicIndex = 0;
  for (const extrinsic of extrinsics) {
    const eventRecords = extractExtrinsicEvents(blockEvents, extrinsicIndex);
    const events = eventRecords.map((record) => record.event);

    const extrinsicIndexer = {
      ...blockIndexer,
      extrinsicIndex: extrinsicIndex++,
    };

    await handleParachainExtrinsic(extrinsic, extrinsicIndexer, events);
    await handlePolkadotXcmExtrinsic(extrinsic, extrinsicIndexer, events);
  }
}

module.exports = {
  handleExtrinsics,
};
