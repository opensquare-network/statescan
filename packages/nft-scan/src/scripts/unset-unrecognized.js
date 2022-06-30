require("dotenv").config();

const { getNftMetadataCollection } = require("../mongo");

async function main() {
  const nftMetadataCol = await getNftMetadataCollection();
  const res = await nftMetadataCol.updateMany(
    { recognized: false },
    { $unset: { recognized: false } }
  );
  console.log({
    modifiedCount: res.modifiedCount,
    matchedCount: res.matchedCount,
  });
}

main().finally(() => process.exit());
