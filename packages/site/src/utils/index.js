import moment from "moment";
import BigNumber from "bignumber.js";
BigNumber.config({ EXPONENTIAL_AT: 12 });

export function addressEllipsis(address, start = 4, end = 4) {
  if (!address) return;
  if (address.length <= start + end) return address;
  if (!address.slice) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function timeDuration(time) {
  return moment(time).fromNow();
}

export function timeUTC(time) {
  return moment.utc(time).format("YYYY-MM-DD HH:mm:ss (+UTC)");
}

export function time(time) {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
}

export function capitalize(string) {
  if (!string || typeof string !== string || string.length === 0) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getPrecision(symbol) {
  switch (symbol) {
    case "KSM":
      return 12;
    case "DOT":
      return 10;
    default:
      return 12;
  }
}

export function fromSymbolUnit(value, symbol) {
  const precision = getPrecision(symbol);
  return new BigNumber(value).dividedBy(Math.pow(10, precision)).toString();
}

export function toSymbolUnit(value, symbol) {
  const precision = getPrecision(symbol);
  return new BigNumber(value).multipliedBy(Math.pow(10, precision)).toString();
}
