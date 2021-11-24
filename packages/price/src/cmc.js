const fetch = require("node-fetch");
const AbortController = require("abort-controller");

const testData = {
  id: 12140,
  name: "RMRK",
  symbol: "RMRK",
  slug: "rmrk",
  num_market_pairs: 2,
  date_added: "2021-09-25T07:30:41.000Z",
  tags: ["collectibles-nfts", "polkadot-ecosystem", "metaverse"],
  max_supply: 10000000,
  circulating_supply: 9500000,
  total_supply: 10000000,
  platform: {
    id: 5034,
    name: "Kusama",
    symbol: "KSM",
    slug: "kusama",
    token_address: "https://statemine.statescan.io/asset/8",
  },
  is_active: 1,
  cmc_rank: 267,
  is_fiat: 0,
  last_updated: "2021-11-24T08:41:11.000Z",
  quote: {
    USDT: {
      price: 36.70114694915339,
      volume_24h: 11390050.947644455,
      volume_change_24h: -12.3264,
      percent_change_1h: -1.04939164,
      percent_change_24h: 3.87277944,
      percent_change_7d: 23.07969433,
      percent_change_30d: 250.86057308,
      percent_change_60d: 0.0285783,
      percent_change_90d: -0.04190357,
      market_cap: 348660896.0169572,
      market_cap_dominance: 0.0134,
      fully_diluted_market_cap: 367011469.4963486,
      last_updated: "2021-11-24T08:42:27.000Z",
    },
  },
};

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

  return testData;
}

module.exports = {
  getLatest,
};
