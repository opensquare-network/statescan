const commonPart = {
  script: "src/index.js",
  log_date_format: "YYYY-MM-DD HH:mm Z",
  env: {
    NODE_ENV: "development",
  },
  env_production: {
    NODE_ENV: "production",
  },
};
const ipfsCommonPart = {
  script: "src/scan-ipfs/index.js",
  log_date_format: "YYYY-MM-DD HH:mm Z",
  env: {
    NODE_ENV: "development",
  },
  env_production: {
    NODE_ENV: "production",
  },
};

function getEnvConfig(chainName) {
  return {
    env: {
      ...commonPart.env,
      CHAIN: chainName,
    },
    env_production: {
      ...commonPart.env_production,
      CHAIN: chainName,
    },
  };
}

const westmintConfig = {
  ...commonPart,
  ...getEnvConfig("westmint"),
};

const statemineConfig = {
  ...commonPart,
  ...getEnvConfig("statemine"),
};

const ipfsWestmintConfig = {
  ...ipfsCommonPart,
  ...getEnvConfig("westmint"),
};

const ipfsStatemineConfig = {
  ...ipfsCommonPart,
  ...getEnvConfig("statemine"),
};

module.exports = {
  apps: [
    {
      name: "statescan-nftscan-westmint",
      ...westmintConfig,
    },
    {
      name: "statescan-nftscan-westmint-staging",
      ...westmintConfig,
    },
    {
      name: "statescan-nftscan-statemine",
      ...statemineConfig,
    },
    {
      name: "statescan-nftscan-statemine-staging",
      ...statemineConfig,
    },
    {
      name: "statescan-ipfsscan-westmint",
      ...ipfsWestmintConfig,
    },
    {
      name: "statescan-ipfsscan-westmint-staging",
      ...ipfsWestmintConfig,
    },
    {
      name: "statescan-ipfsscan-statemine",
      ...ipfsStatemineConfig,
    },
    {
      name: "statescan-ipfsscan-statemine-staging",
      ...ipfsStatemineConfig,
    },
  ],
};
