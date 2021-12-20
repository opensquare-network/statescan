require("dotenv").config();
const { closeDataDbClient } = require("./mongo");
const { closeKnownClient } = require("./mongo/knownHeight");
const { getNftTransferCollection } = require("./mongo");
const { getInstanceAttributeCollection } = require("./mongo");
const { getInstanceTimelineCollection } = require("./mongo");
const { getInstanceCollection } = require("./mongo");
const { getClassAttributeCollection } = require("./mongo");
const { saveKnownHeights } = require("./mongo/service/known");
const { getClassTimelineCollection } = require("./mongo");
const { getClassCollection } = require("./mongo");

async function main() {
  const heights = [];
  const classCol = await getClassCollection();
  const classes = await classCol.find({}).toArray();
  heights.push(...classes.map((c) => c.indexer.blockHeight));

  const classTimelineCol = await getClassTimelineCollection();
  const timelineArr = await classTimelineCol.find({}).toArray();
  heights.push(...timelineArr.map((t) => t.indexer.blockHeight));

  let col = await getClassAttributeCollection();
  let arr = await col.find({}).toArray();
  heights.push(...arr.map((t) => t.indexer.blockHeight));

  await saveKnownHeights(heights);
  heights.splice(0);

  col = await getInstanceCollection();
  arr = await col.find({}).toArray();
  heights.push(...arr.map((t) => t.indexer.blockHeight));

  col = await getInstanceTimelineCollection();
  arr = await col.find({}).toArray();
  heights.push(...arr.map((t) => t.indexer.blockHeight));

  col = await getInstanceAttributeCollection();
  arr = await col.find({}).toArray();
  heights.push(...arr.map((t) => t.indexer.blockHeight));

  await saveKnownHeights(heights);
  heights.splice(0);

  col = await getNftTransferCollection();
  arr = await col.find({}).toArray();
  heights.push(...arr.map((t) => t.indexer.blockHeight));

  await saveKnownHeights(heights);
  heights.splice(0);
}

main()
  .then(async () => {
    console.log("Known heights saved");
    await closeDataDbClient();
    await closeKnownClient();
  })
  .catch(console.error);
