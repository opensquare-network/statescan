const { normalizeExtrinsics } = require("../utils/normalize/extrinsic");
const { getBlockIndexer } = require("@statescan/utils");
const { getUnFinalizedExrinsicCollection } = require("../mongo/index");

async function saveBlocksExtrinsicData(blockDataArr = []) {
  const extrinsics = blockDataArr.reduce((result, { block, events }) => {
    const blockIndexer = getBlockIndexer(block.block);
    const normalizedExtrinsics = normalizeExtrinsics(
      block.block.extrinsics,
      events,
      blockIndexer
    );
    return [...result, ...normalizedExtrinsics];
  }, []);

  const col = await getUnFinalizedExrinsicCollection();
  const bulk = col.initializeOrderedBulkOp();

  bulk.find({}).delete();
  for (const extrinsic of extrinsics) {
    bulk.insert(extrinsic);
  }

  await bulk.execute();
}

module.exports = {
  saveBlocksExtrinsicData,
};
