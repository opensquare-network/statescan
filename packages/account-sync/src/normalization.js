const { encodeAddress } = require("@polkadot/util-crypto");
const {
  env: { currentChain },
} = require("@statescan/common");
const { allNetworks } = require("@polkadot/networks");

function getRelayChainNetwork(chain) {
  if (chain === "statemine") {
    return "kusama";
  } else if (chain === "westmint") {
    return "westend";
  }
  return "polkadot";
}

function normalizeEntry([key, value]) {
  const relayChain = getRelayChainNetwork(currentChain());
  const targetNetwork = allNetworks.find(
    ({ network }) => network === relayChain
  );
  const pubKeyU8a = key.slice(48);
  const addr = encodeAddress(pubKeyU8a, targetNetwork.prefix);
  const detail = value.toJSON();

  return {
    addr,
    detail,
  };
}

module.exports = {
  normalizeEntry,
};
