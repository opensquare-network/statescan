const {
  getKsmUsdtDailyCollection,
  getDotUsdtDailyCollection,
  getLitUsdtDailyCollection,
} = require("../../mongo/pricedb");

async function getDailyPrices(ctx) {
  const { chain } = ctx.params;

  let items = [];

  // Kusama data only
  let col = null;
  if (chain === "statemine") {
    col = await getKsmUsdtDailyCollection();
  } else if (chain === "statemint") {
    col = await getDotUsdtDailyCollection();
  } else if (chain === "litmus") {
    col = await getLitUsdtDailyCollection();
  }

  if (col) {
    items = await col.find({}).sort({ openTime: -1 }).limit(30).toArray();
  }

  ctx.body = items.map((item) => ({
    time: item.openTime,
    price: item.quoteAssetVolume / item.volume,
  }));
}

module.exports = {
  getDailyPrices,
};
