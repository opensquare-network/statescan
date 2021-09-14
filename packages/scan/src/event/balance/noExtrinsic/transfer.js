const {
  addNativeTransfer,
} = require("../../../store/blockNativeTokenTransfers");
const { addAddresses } = require("../../../store/blockAddresses");

async function handleTransfer(event, eventSort, blockIndexer) {
  const eventData = event.data.toJSON();
  const [from, to, value] = eventData;
  addAddresses(blockIndexer.blockHeight, [from, to]);
  addNativeTransfer(blockIndexer.blockHeight, {
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
