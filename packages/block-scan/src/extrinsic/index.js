const { ignoreInExtrinsicList } = require("../utils/checkSystem");
const { extractExtrinsicEvents } = require("../utils");
const { addAddress } = require("../store/blockAddresses");

async function handleExtrinsics(extrinsics = [], allEvents = [], blockIndexer) {
  let index = 0;
  for (const extrinsic of extrinsics) {
    const events = extractExtrinsicEvents(allEvents, index);

    await handleExtrinsic(
      extrinsic,
      {
        ...blockIndexer,
        index: index++,
      },
      events
    );
  }
}

async function handleExtrinsic(extrinsic, indexer) {
  let signer = extrinsic.signer.toString();
  //如果signer的解析长度不正确，则该交易是无签名交易
  if (signer.length < 47) {
    signer = "";
  }

  if (!ignoreInExtrinsicList(extrinsic.method) && signer) {
    addAddress(indexer.blockHeight, signer);
  }
}

module.exports = {
  handleExtrinsics,
};
