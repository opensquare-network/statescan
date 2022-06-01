const isIPFS = require("is-ipfs");

function isCid(cid) {
  return isIPFS.cid(cid) || isIPFS.base32cid(cid.toLowerCase());
}

module.exports = {
  isCid,
};
