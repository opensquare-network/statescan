const CHAINS = {
  STATEMINE: "statemine",
  STATEMINT: "statemint",
  WESTMINT: "westmint",
};

function currentChain() {
  if (CHAINS.values().includes(process.env.CHAIN)) {
    return process.env.CHAIN;
  } else {
    return "statemint";
  }
}

module.exports = {
  CHAINS,
  currentChain,
};
