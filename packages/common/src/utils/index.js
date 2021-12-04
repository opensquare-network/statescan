const BigNumber = require("bignumber.js");

function extractExtrinsicEvents(events, extrinsicIndex) {
  return events.filter((event) => {
    const { phase } = event;
    return !phase.isNull && phase.value.toNumber() === extrinsicIndex;
  });
}

function bigAdd(v1, v2) {
  return new BigNumber(v1).plus(v2).toString();
}

module.exports = {
  extractExtrinsicEvents,
  bigAdd,
};
