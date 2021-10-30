const log4js = require("log4js");

const logLevel = process.env.LOG_LEVEL || "debug";
const isProduction = process.env.NODE_ENV === "production";

const statusCategory = "xcm-scan";
const blockFileCategory = "block";
const xcmFileCategory = "xcm";

log4js.configure({
  appenders: {
    [statusCategory]: { type: "file", filename: `log/scan.log` },
    [blockFileCategory]: { type: "file", filename: `log/block.log` },
    [xcmFileCategory]: { type: "file", filename: `log/xcm.log` },
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
      appenders: [isProduction ? statusCategory : "out", "errors"],
      level: logLevel,
    },
    [blockFileCategory]: {
      appenders: [isProduction ? blockFileCategory : "out", "errors"],
      level: logLevel,
    },
    [xcmFileCategory]: {
      appenders: [isProduction ? xcmFileCategory : "out", "errors"],
      level: logLevel,
    },
  },
});

const logger = log4js.getLogger(statusCategory);
const blockLogger = log4js.getLogger(blockFileCategory);
const xcmLogger = log4js.getLogger(xcmFileCategory);

module.exports = {
  logger,
  blockLogger,
  xcmLogger,
};
