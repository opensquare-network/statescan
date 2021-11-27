const { getApi } = require("@statescan/utils");
const { findBlockApi } = require("../../../chain/blockApi");

async function queryClassMetadata(classId, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.uniques.classMetadataOf(classId);
  return raw.toJSON();
}

async function queryClassMetadataByHeight(classId, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return queryClassMetadata(classId, {
    blockHeight,
    blockHash,
  });
}

module.exports = {
  queryClassMetadata,
  queryClassMetadataByHeight,
};
