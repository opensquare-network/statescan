const {
  getEventCollection,
  getUnFinalizedEventCollection,
  getExtrinsicCollection,
  getUnFinalizedExrinsicCollection,
  getUnFinalizedBlockCollection,
  getBlockCollection,
} = require("../mongo");
const {
  getRawAddressCollection,
} = require("../mongo/account");

async function deleteUnFinalizedBlockFromHeight(height) {
  const col = await getUnFinalizedBlockCollection();
  await col.deleteMany({ "header.number": { $gte: height } });
}

async function deleteBlockFromHeight(height) {
  const col = await getBlockCollection();
  await col.deleteMany({ "header.number": { $gte: height } });
}

async function deleteUnFinalizedExtrinsicsFromHeight(height) {
  const col = await getUnFinalizedExrinsicCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: height } });
}

async function deleteExtrinsicsFromHeight(height) {
  const col = await getExtrinsicCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: height } });
}

async function deleteUnFinalizedEventsFromHeight(height) {
  const col = await getUnFinalizedEventCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: height } });
}

async function deleteEventsFromHeight(height) {
  const col = await getEventCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: height } });
}

async function deleteRawAddressesFromHeight(height) {
  const col = await getRawAddressCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: height } });
}

async function deleteFromHeight(height) {
  await deleteUnFinalizedEventsFromHeight(height);
  await deleteEventsFromHeight(height);
  await deleteUnFinalizedExtrinsicsFromHeight(height);
  await deleteExtrinsicsFromHeight(height);
  await deleteUnFinalizedBlockFromHeight(height);
  await deleteBlockFromHeight(height);
  await deleteRawAddressesFromHeight(height);
}

module.exports = {
  deleteFromHeight,
};
