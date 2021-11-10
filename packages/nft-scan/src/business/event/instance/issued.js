const { addIssuance } = require("../../../store/blockIssuance");

async function handleIssued(event, indexer, blockEvents, extrinsic) {
  const [classId, instanceId, owner] = event.data.toJSON();
  addIssuance(indexer.blockHeight, { classId, instanceId, owner, indexer });
}

module.exports = {
  handleIssued,
};
