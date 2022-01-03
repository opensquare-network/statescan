const {
  addNativeTransfer,
} = require("../../common/store/blockNativeTokenTransfers");

async function handleTransfer(event, indexer, extrinsic) {
  const eventData = event.data.toJSON();
  const [from, to, value] = eventData;

  const { section: extrinsicSection, method: extrinsicMethod } =
    extrinsic.method;
  let transfer = {
    indexer,
    module: extrinsicSection,
    method: extrinsicMethod,
    from,
    to,
    balance: value, // FIXME: value should be converted to decimal 128(call toDecimal128)
    listIgnore: false,
  };

  if (extrinsic) {
    const extrinsicHash = extrinsic.hash.toJSON();
    transfer = {
      ...transfer,
      extrinsicHash,
    };
  }

  addNativeTransfer(indexer.blockHash, transfer);
}

module.exports = {
  handleTransfer,
};
