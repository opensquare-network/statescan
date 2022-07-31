module.exports = {
  apps: [
    {
      name: "lit-daily-price-tracker",
      script: "src/index.js",
      args: "--symbol=LIT",
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
