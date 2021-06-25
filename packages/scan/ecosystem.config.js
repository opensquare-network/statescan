module.exports = {
  apps: [
    {
      name: "statescan-scan-wnd",
      script: "src/index.js",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_ENV: "development",
        CHAIN: "westmint",
      },
      env_production: {
        NODE_ENV: "production",
        CHAIN: "westmint",
      },
    },
    {
      name: "statescan-scan-wnd-staging",
      script: "src/index.js",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_ENV: "development",
        CHAIN: "westmint",
      },
      env_production: {
        NODE_ENV: "production",
        CHAIN: "westmint",
      },
    },
  ],
};
