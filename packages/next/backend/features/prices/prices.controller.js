const {
  getKsmUsdtDailyCollection,
  getDotUsdtDailyCollection,
} = require("../../mongo/pricedb");

async function getDailyPrices(ctx) {
  const { chain } = ctx.params;

  let items = [];

  // Kusama data only
  if (chain === "statemine") {
    const col = await getKsmUsdtDailyCollection();
    items = await col.find({}).sort({ openTime: -1 }).limit(30).toArray();
  } else if (chain === "statemint") {
    const col = await getDotUsdtDailyCollection();
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
