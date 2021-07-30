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

module.exports = {
  apps: [
    {
      name: "statescan-scan-westmint",
      ...westmintConfig,
    },
    {
      name: "statescan-scan-westmint-staging",
      ...westmintConfig,
    },
    {
      name: "statescan-scan-statemine",
      ...statemineConfig,
    },
    {
      name: "statescan-scan-statemine-staging",
      ...statemineConfig,
    },
  ],
};
