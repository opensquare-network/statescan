const { getIssuance } = require("../../store/blockIssuance");

async function handleBlockIssuance(blockIndexer) {
  const issuanceArr = getIssuance(blockIndexer.blockHeight);
  if (issuanceArr.length <= 0) {
    return;
  }

  for (const { classId, instanceId, owner, indexer } of issuanceArr) {
  }
}
