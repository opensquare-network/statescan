const { normalizeBinanceKline } = require("../common/binance");
const { getLitUsdtDailyCollection } = require("../mongo");
const { getKlines } = require("../binance");
const symbol = "LIT";

async function getNextStart() {
  const col = await getLitUsdtDailyCollection();
  const latestItem = (
    await col.find({}).sort({ openTime: -1 }).limit(1).toArray()
  )[0];

  return latestItem ? latestItem.closeTime + 1 : 0;
}

async function batch(arr) {
  const col = await getLitUsdtDailyCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const item of arr) {
    bulk
      .find({ openTime: item.openTime })
      .upsert()
      .update({
        $setOnInsert: {
          ...item,
        },
      });
  }

  await bulk.execute();
}

async function main() {
  const start = await getNextStart();
  const klineArray = await getKlines(symbol, start);
  const normalizedArray = (klineArray || []).map(normalizeBinanceKline);
  await batch(normalizedArray);

  console.log(`${normalizedArray.length} items saved!`);
  process.exit(0);
}

main().then(console.log);
