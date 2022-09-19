const { handleSystemEvent } = require("./system");

async function handleEvents(events, blockIndexer, extrinsics) {
  if (events.length <= 0) {
    return;
  }

  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];
    let [phaseValue, extrinsicHash] = [null, null];
    if (!phase.isNone) {
      phaseValue = phase.value.toNumber();
      const extrinsic = extrinsics[phaseValue];
      extrinsicHash = extrinsic.hash.toHex();
      const extrinsicIndex = phaseValue;

      await handleSystemEvent(
        event,
        sort,
        extrinsicIndex,
        extrinsicHash,
        blockIndexer
      );
    }
  }
}

module.exports = {
  handleEvents,
};
