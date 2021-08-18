const moment = require("moment-timezone");

let lastBlockDate = null;
let lastTimestamp = null;

function setLastBlockDate(timestamp) {
  lastTimestamp = timestamp;
  lastBlockDate = moment(timestamp).utc().format("YYYYMMDD");
}

function isNewDay(timestamp) {
  if (!lastBlockDate) {
    return false;
  }

  const day = moment(timestamp).utc().format("YYYYMMDD");
  return day !== lastBlockDate;
}

module.exports = {
  setLastBlockDate,
  isNewDay,
};
