const CHAINS = {
  STATEMINE: "statemine",
  STATEMINT: "statemint",
  WESTMINT: "westmint",
};

function currentChain() {
  if (Object.values(CHAINS).includes(process.env.CHAIN)) {
    return process.env.CHAIN;
  } else {
    return "statemint";
  }
}

module.exports = {
  CHAINS,
  currentChain,
};
