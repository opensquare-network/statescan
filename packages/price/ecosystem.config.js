module.exports = {
  apps: [
    {
      name: "ksm-monthly-price-tracker",
      script: "src/index.js",
      args: "--symbol=KSM",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "dot-monthly-price-tracker",
      script: "src/index.js",
      args: "--symbol=DOT",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
