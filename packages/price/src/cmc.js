const fetch = require("node-fetch");
const AbortController = require("abort-controller");

const cmcToken =
  process.env.CMC_TOKEN || "35706415-330b-4054-906c-6b5fd57c1192";

async function getLatest(symbol, startTime = 0) {
  const url = new URL(
    "v1/cryptocurrency/quotes/latest",
    "https://pro-api.coinmarketcap.com"
  );
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("convert", "USDT");

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 3000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "X-CMC_PRO_API_KEY": cmcToken,
      },
    });
    const json = await res.json();
    return json.data[symbol];
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("request was aborted");
    }
  } finally {
    clearTimeout(timeout);
  }

  return;
}

module.exports = {
  getLatest,
};
