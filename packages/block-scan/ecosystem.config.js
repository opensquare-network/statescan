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

const statemintConfig = {
  ...commonPart,
  ...getEnvConfig("statemint"),
};

module.exports = {
  apps: [
    {
      name: "statescan-block-scan-westmint",
      ...westmintConfig,
    },
    {
      name: "statescan-block-scan-westmint-staging",
      ...westmintConfig,
    },
    {
      name: "statescan-block-scan-statemine",
      ...statemineConfig,
    },
    {
      name: "statescan-block-scan-statemine-staging",
      ...statemineConfig,
    },
    {
      name: "statescan-block-scan-statemint",
      ...statemintConfig,
    },
    {
      name: "statescan-block-scan-statemint-staging",
      ...statemintConfig,
    },
  ],
};
