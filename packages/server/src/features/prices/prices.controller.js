const { getKsmUsdtMonthlyCollection } = require("../../mongo");

async function getMonthlyPrices(ctx) {
  const { chain } = ctx.params;

  let items = [];

  // Kusama data only
  if (chain === "statemine") {
    const col = await getKsmUsdtMonthlyCollection();
    items = await col.find({}).sort({ openTime: 1 }).toArray();
  }

  ctx.body = items.map((item) => ({
    time: item.openTime,
    price: item.quoteAssetVolume / item.volume,
  }));
}

module.exports = {
  getMonthlyPrices,
};
