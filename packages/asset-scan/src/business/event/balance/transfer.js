const {
  addNativeTransfer,
} = require("../../common/store/blockNativeTokenTransfers");

async function handleTransfer(event, indexer, extrinsic) {
  const eventData = event.data.toJSON();
  const [from, to, value] = eventData;

  let transfer = {
    indexer,
    from,
    to,
    balance: value, // FIXME: value should be converted to decimal 128(call toDecimal128)
    listIgnore: !!!extrinsic,
  };

  if (extrinsic) {
    const { section: extrinsicSection, method: extrinsicMethod } =
      extrinsic.method;
    const extrinsicHash = extrinsic.hash.toJSON();
    transfer = {
      ...transfer,
      module: extrinsicSection,
      method: extrinsicMethod,
      extrinsicHash,
    };
  }

  addNativeTransfer(indexer.blockHash, transfer);
}

module.exports = {
  handleTransfer,
};
