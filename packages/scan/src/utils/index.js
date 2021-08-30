const { Decimal128 } = require("mongodb");
const BigNumber = require("bignumber.js");

function extractExtrinsicEvents(events, extrinsicIndex) {
  return events.filter((event) => {
    const { phase } = event;
    return !phase.isNull && phase.value.toNumber() === extrinsicIndex;
  });
}

function isExtrinsicSuccess(events) {
  return events.some((e) => e.event.method === "ExtrinsicSuccess");
}

function getExtrinsicSigner(extrinsic) {
  let signer = extrinsic._raw.signature.get("signer").toString();
  return signer;
}

function isHex(blockData) {
  if (typeof blockData !== "string") {
    return false;
  }

  return blockData.startsWith("0x");
}

function toDecimal128(num) {
  return Decimal128.fromString(new BigNumber(num).toString());
}

module.exports = {
  isHex,
  isExtrinsicSuccess,
  extractExtrinsicEvents,
  getExtrinsicSigner,
  toDecimal128,
};
