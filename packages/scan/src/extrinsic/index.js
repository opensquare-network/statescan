const { isSystemCall } = require("../utils/checkSystem");
const { extractExtrinsicEvents } = require("../utils");
const {
  handleTeleportAssetDownwardMessage,
  handleTeleportAssets,
} = require("./xcm");
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

  await handleTeleportAssetDownwardMessage(extrinsic, indexer);
  await handleTeleportAssets(extrinsic, indexer, signer);

  if (!isSystemCall(extrinsic.method) && signer) {
    addAddress(indexer.blockHeight, signer);
  }
}

module.exports = {
  handleExtrinsics,
};
