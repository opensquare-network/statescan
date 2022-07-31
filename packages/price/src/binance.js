async function getKlines(symbol, startTime = 0) {
  const url = new URL("api/v3/klines", "https://api.binance.com");
  url.searchParams.set("symbol", `${symbol}USDT`);
  url.searchParams.set("interval", "1d");
  url.searchParams.set("limit", "500");
  url.searchParams.set("startTime", `${startTime}`);

  const res = await fetch(url);
  return await res.json();
}

module.exports = {
  getKlines,
};
