const dotenv = require("dotenv");
dotenv.config();

const dayjs = require("dayjs");
const { MongoClient } = require("mongodb");
const { getRmrkUsdtDailyCollection } = require("./mongo");

const RMRK_ASSET_ID = 5;
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

function getScanDbName() {
  const dbName = process.env.MONGO_SCAN_DB_NAME;
  if (!dbName) {
    throw new Error("MONGO_SCAN_DB_NAME not set");
  }

  return dbName;
}

// Get asset collection from scan db
async function getAssetCollection() {
  const client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  const scanDbName = getScanDbName();
  const scanDb = client.db(scanDbName);
  const assetCol = scanDb.collection("asset");

  return assetCol;
}

// Set RMRK token price to scan db
async function main() {
  const assetCol = await getAssetCollection();
  const rmrkUsdtCol = await getRmrkUsdtDailyCollection();

  // Find latest RMRK token price
  const [rmrkPrice] = await rmrkUsdtCol.find({}).sort({ time: -1 }).limit(1).toArray();
  if (rmrkPrice) {
    // Update RMRK token price to scan db
    await assetCol.updateOne(
      {
        assetId: RMRK_ASSET_ID,
        destroyedAt: null,
      },
      {
        $set: {
          price: {
            value: rmrkPrice.price,
            time: rmrkPrice.time,
          }
        }
      }
    );
    console.log(
      `RMRK price saved to scan db: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`
    );
  }
}

main().catch(console.error).then(() => process.exit(0));
