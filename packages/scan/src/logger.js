const log4js = require("log4js");
const { CHAINS } = require("./envvars");

const logLevel = process.env.LOG_LEVEL || "debug";
const isProduction = process.env.NODE_ENV === "production";
const chain = process.env.CHAIN || CHAINS.STATEMINE;

const scanFileCategory = "block-scan";
const statisticFileCategory = "statistic";

log4js.configure({
  appenders: {
    [scanFileCategory]: { type: "file", filename: `log/${chain}/scan.log` },
    [statisticFileCategory]: {
      type: "file",
      filename: `log/${chain}/statistic.log`,
    },
    errorFile: {
      type: "file",
      filename: `log/${chain}/errors.log`,
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
  },
});

const logger = log4js.getLogger(scanFileCategory);
const statisticLogger = log4js.getLogger(statisticFileCategory);

module.exports = {
  logger,
  statisticLogger,
};
