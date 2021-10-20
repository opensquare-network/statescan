const log4js = require("log4js");

const logLevel = process.env.LOG_LEVEL || "debug";
const isProduction = process.env.NODE_ENV === "production";

const nftCategory = "nft-scan";
const blockFileCategory = "block";

log4js.configure({
  appenders: {
    [nftCategory]: { type: "file", filename: `log/scan.log` },
    [blockFileCategory]: { type: "file", filename: `log/block.log` },
    errorFile: {
      type: "file",
      filename: `log/errors.log`,
    },
    errors: {
      type: "logLevelFilter",
      level: "ERROR",
      appender: "errorFile",
    },
    out: { type: "stdout" },
  },
  categories: {
    default: {
      appenders: [isProduction ? nftCategory : "out", "errors"],
      level: logLevel,
    },
    [blockFileCategory]: {
      appenders: [isProduction ? blockFileCategory : "out", "errors"],
      level: logLevel,
    },
  },
});

const logger = log4js.getLogger(nftCategory);
const blockLogger = log4js.getLogger(blockFileCategory);

module.exports = {
  logger,
  blockLogger,
};
