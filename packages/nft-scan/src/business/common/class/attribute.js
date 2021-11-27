const { getApi } = require("@statescan/utils");
const { findBlockApi } = require("../../../chain/blockApi");

async function queryClassAttribute(classId, key, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.uniques.attribute(classId, null, key);
  return raw.toJSON();
}

async function queryClassAttributeByHeight(classId, key, blockHeight) {
  const api = await getApi();
  const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
  return queryClassAttribute(classId, key, {
    blockHeight,
    blockHash,
  });
}

module.exports = {
  queryClassAttribute,
  queryClassAttributeByHeight,
};
