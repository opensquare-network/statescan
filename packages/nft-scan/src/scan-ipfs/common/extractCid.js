const { isHex, hexToString } = require("@polkadot/util");

const ipfsUrlPrefix = "ipfs://ipfs/";

function extractCid(hex = "") {
  let cidStr = hex;
  if (isHex(hex)) {
    cidStr = hexToString(hex);
  }

  if ((cidStr || "").startsWith(ipfsUrlPrefix)) {
    cidStr = cidStr.slice(ipfsUrlPrefix.length);
  }

  return cidStr;
}

module.exports = {
  extractCid,
};
