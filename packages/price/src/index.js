const dotenv = require("dotenv");
dotenv.config();

const dayjs = require("dayjs");
const { getKlines } = require("./binance");
const { getLatest } = require("./gate");
const {
  getKsmUsdtDailyCollection,
  getDotUsdtDailyCollection,
  getRmrkUsdtDailyCollection,
  getLitUsdtDailyCollection,
} = require("./mongo");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getCollection(symbol) {
  if (symbol === "DOT") {
    return getDotUsdtDailyCollection();
  } else if (symbol === "KSM") {
    return getKsmUsdtDailyCollection();
  } else if (symbol === "RMRK") {
    return getRmrkUsdtDailyCollection();
  } else if (symbol === "LIT") {
    return getLitUsdtDailyCollection();
  } else {
    throw new Error("Unsupport symbol " + symbol);
  }
}

async function saveKlines(col, klines) {
  if (klines && klines.length > 0) {
    const bulk = col.initializeUnorderedBulkOp();
    for (const item of klines) {
      const [
        openTime,
        open,
        high,
        low,
        close,
        volume,
        closeTime,
        quoteAssetVolume,
        numberOfTrades,
        takerBuyBaseAssetVolume,
        takerBuyQuoteAssetVolume,
      ] = item;

      bulk.insert({
        openTime,
        open,
        high,
        low,
        close,
        volume,
        closeTime,
        quoteAssetVolume,
        numberOfTrades,
        takerBuyBaseAssetVolume,
        takerBuyQuoteAssetVolume,
      });
    }

    await bulk.execute();
  }
}

async function saveLatest(col, latest) {
  const price = latest.last;
  const time = new Date().getTime();
  await col.insertOne({
    price,
    time,
  });
}

async function tick(symbol) {
  const col = await getCollection(symbol);

  const latestItem = (
    await col.find({}).sort({ openTime: -1 }).limit(1).toArray()
  )[0];
  let klines = null;
  if (latestItem) {
    const nextStartTime = latestItem.closeTime + 1;
    klines = await getKlines(symbol, nextStartTime);
  } else {
    klines = await getKlines(symbol);
  }

  await saveKlines(col, klines);

  return klines?.[klines.length - 1]?.[0] || latestItem?.openTime;
}

async function tickEveryMinute(symbol) {
  const col = await getCollection(symbol);

  const latest = await getLatest(symbol);

  if (latest?.last) {
    await saveLatest(col, latest);
    console.log(`rmrk price saved!`);
  }
}

async function main() {
  const symbol = process.env.SYMBOL;

  if (!["DOT", "KSM", "RMRK", "LIT"].includes(symbol)) {
    console.log(`Unknown symbol "${symbol}"`);
    return;
  }

  while (true) {
    if (["DOT", "KSM", "LIT"].includes(args.symbol)) {
      let latestOpenTime = null;

      try {
        latestOpenTime = await tick(symbol);
        console.log(
          `${symbol} price saved: ${dayjs(latestOpenTime).format(
            "YYYY-MM-DD HH:mm:ss"
          )}`
        );
      } catch (e) {
        console.error(e.message);
      }

      // Reduce the call rate when the latest open time is very close to the current time,
      if (
        latestOpenTime &&
        dayjs(latestOpenTime).add(1, "d").toDate().getTime() > Date.now()
      ) {
        await sleep(60 * 60 * 1000);
      } else {
        await sleep(2 * 1000);
      }
    } else if (["RMRK"].includes(symbol)) {
      await tickEveryMinute(symbol);
      await sleep(60 * 1000);
    }
  }
}

main().catch(console.error);
