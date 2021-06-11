const CHAINS = {
  POLKADOT: "polkadot",
  KUSAMA: "kusama",
  ROCOCO: "rococo",
};

function currentChain() {
  if (["polkadot", "kusama", "rococo"].includes(process.env.CHAIN)) {
    return process.env.CHAIN;
  } else {
    return "rococo";
  }
}

module.exports = {
  CHAINS,
  currentChain,
};
