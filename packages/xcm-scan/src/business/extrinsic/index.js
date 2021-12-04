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

    await handleParachainExtrinsic(
      extrinsic,
      {
        ...blockIndexer,
        index: index++,
      },
      events
    );
  }
}

module.exports = {
  handleExtrinsics,
};
