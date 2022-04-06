const { isHex, hexToString } = require("@polkadot/util");

const ipfsUrlPrefix = "ipfs://ipfs/";
const ipfsUrlShortPrefix = "ipfs://";

function extractCid(hex = "") {
  let cidStr = hex;
  if (isHex(hex)) {
    cidStr = hexToString(hex);
  }

  if ((cidStr || "").startsWith(ipfsUrlPrefix)) {
    cidStr = cidStr.slice(ipfsUrlPrefix.length);
  } else if ((cidStr || "").startsWith(ipfsUrlShortPrefix)) {
    cidStr = cidStr.slice(ipfsUrlShortPrefix.length);
  }

  return cidStr;
}

module.exports = {
  extractCid,
};
