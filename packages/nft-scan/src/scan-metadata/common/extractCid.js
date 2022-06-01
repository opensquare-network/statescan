const { isHex, hexToString } = require("@polkadot/util");

const ipfsUrlPrefix = "ipfs://ipfs/";
const ipfsUrlShortPrefix = "ipfs://";
const abnormalPrefix = "Ipfs://";

function extractCid(hex = "") {
  let cidStr = hex;
  if (isHex(hex)) {
    cidStr = hexToString(hex);
  }

  if ((cidStr || "").startsWith(ipfsUrlPrefix)) {
    cidStr = cidStr.slice(ipfsUrlPrefix.length);
  } else if ((cidStr || "").startsWith(ipfsUrlShortPrefix)) {
    cidStr = cidStr.slice(ipfsUrlShortPrefix.length);
  } else if ((cidStr || "").startsWith(abnormalPrefix)) {
    cidStr = cidStr.slice(abnormalPrefix.length);
  }

  return cidStr;
}

module.exports = {
  extractCid,
};
