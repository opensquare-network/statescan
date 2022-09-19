const BigNumber = require("bignumber.js");
const { Decimal128 } = require("mongodb");

function extractExtrinsicEvents(events, extrinsicIndex) {
  return events.filter((event) => {
    const { phase } = event;
    return !phase.isNone && phase.value.toNumber() === extrinsicIndex;
  });
}

function bigAdd(v1, v2) {
  return new BigNumber(v1).plus(v2).toString();
}

function gt(v1, v2) {
  return new BigNumber(v1).isGreaterThan(v2);
}

function toDecimal128(num) {
  return Decimal128.fromString(new BigNumber(num).toString());
}

module.exports = {
  extractExtrinsicEvents,
  bigAdd,
  gt,
  toDecimal128,
};
