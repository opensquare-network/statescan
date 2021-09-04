const { getBlockCollection } = require("../mongo");

async function saveData(block, session) {
  const blockCol = await getBlockCollection();

  const result = await blockCol.insertOne(block, { session });
  if (result.result && !result.result.ok) {
    // TODO: Handle insertion failed
  }
}

module.exports = {
  saveData,
};
