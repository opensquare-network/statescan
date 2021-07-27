module.exports = {
  apps: [
    {
      name: "statescan-next",
      script: "yarn",
      interpreter: "bash",
      args: "start",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "statescan-next-staging",
      script: "yarn",
      interpreter: "bash",
      args: "start",
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
