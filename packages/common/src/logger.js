const log4js = require("log4js");

const logLevel = process.env.LOG_LEVEL || "debug";
const isProduction = process.env.NODE_ENV === "production";

const scanFileCategory = "block-scan";
const statisticFileCategory = "statistic";
const teleportFileCategory = "teleport";
const blockFileCategory = "block";

log4js.configure({
  appenders: {
    [scanFileCategory]: { type: "file", filename: `log/scan.log` },
    [statisticFileCategory]: { type: "file", filename: `log/statistic.log` },
    [teleportFileCategory]: { type: "file", filename: `log/teleport.log` },
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
      appenders: [isProduction ? scanFileCategory : "out", "errors"],
      level: logLevel,
    },
    [statisticFileCategory]: {
      appenders: [isProduction ? statisticFileCategory : "out", "errors"],
      level: logLevel,
    },
    [teleportFileCategory]: {
      appenders: [isProduction ? teleportFileCategory : "out", "errors"],
      level: logLevel,
    },
    [blockFileCategory]: {
      appenders: [
        isProduction ? blockFileCategory : "out",
        isProduction ? blockFileCategory : "errors",
      ],
      level: logLevel,
    },
  },
});

const logger = log4js.getLogger(scanFileCategory);
const statisticLogger = log4js.getLogger(statisticFileCategory);
const teleportLogger = log4js.getLogger(teleportFileCategory);
const blockLogger = log4js.getLogger(blockFileCategory);

module.exports = {
  logger,
  statisticLogger,
  teleportLogger,
  blockLogger,
};
