const CHAINS = {
  KUSAMA: "kusama",
  ROCOCO: "rococo",
  WESTEN: "westen",
};

function currentChain() {
  if (["kusama", "rococo", "westen"].includes(process.env.CHAIN)) {
    return process.env.CHAIN;
  } else {
    return "rococo";
  }
}

module.exports = {
  CHAINS,
  currentChain,
};
