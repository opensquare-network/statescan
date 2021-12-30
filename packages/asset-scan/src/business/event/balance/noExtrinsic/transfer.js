const {
  saveNativeTokenTransfer,
} = require("../../../../mongo/services/nativeToken");

async function handleTransfer(event, eventSort, blockIndexer) {
  const eventData = event.data.toJSON();
  const [from, to, value] = eventData;
  await saveNativeTokenTransfer(blockIndexer, {
    indexer: blockIndexer,
    eventSort,
    from,
    to,
    balance: value, // FIXME: value should be converted to decimal 128(call toDecimal128)
    listIgnore: true,
  });
}

module.exports = {
  handleTransfer,
};
