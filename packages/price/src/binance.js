const AbortController = require("abort-controller");

async function getKlines(symbol, startTime = 0) {
  const url = new URL("api/v3/klines", "https://api.binance.com");
  url.searchParams.set("symbol", `${symbol}USDT`);
  url.searchParams.set("interval", "1d");
  url.searchParams.set("limit", "500");
  url.searchParams.set("startTime", `${startTime}`);

  try {
    const res = await fetch(url);
    const json = await res.json();
    return json;
  } catch (err) {
    console.log(err);
    if (err.name === "AbortError") {
      console.log("request was aborted");
    }
  }

  return [];
}

module.exports = {
  getKlines,
};
