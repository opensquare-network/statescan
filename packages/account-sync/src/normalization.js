const { encodeAddress } = require("@polkadot/util-crypto");
const {
  env: { currentChain },
} = require("@statescan/common");
const { allNetworks } = require("@polkadot/networks");
const isNil = require("lodash.isnil");

function getRelayChainNetwork(chain) {
  if (chain === "statemine") {
    return "kusama";
  } else if (chain === "westmint") {
    return "westend";
  }
  return "polkadot";
}

function getSs58Format() {
  const chain = currentChain();
  let possibleValue = {
    litmus: 131,
  }[chain];

  if (!isNil(possibleValue)) {
    return possibleValue;
  }

  const relayChain = getRelayChainNetwork(currentChain());
  const targetNetwork = allNetworks.find(
    ({ network }) => network === relayChain
  );

  return targetNetwork?.prefix || 42;
}

function normalizeEntry([key, value]) {
  const pubKeyU8a = key.slice(48);
  const addr = encodeAddress(pubKeyU8a, getSs58Format());
  const detail = value.toJSON();

  return {
    addr,
    detail,
  };
}

module.exports = {
  normalizeEntry,
};
