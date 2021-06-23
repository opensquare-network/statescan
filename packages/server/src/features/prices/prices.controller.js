const { getKsmUsdtDailyCollection } = require("../../mongo");

async function getDailyPrices(ctx) {
  const { chain } = ctx.params;

  let items = [];

  // Kusama data only
  if (chain === "kusama") {
    const col = await getKsmUsdtDailyCollection();
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
