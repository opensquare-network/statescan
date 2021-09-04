const { extractExtrinsicEvents } = require("../utils");
const { u8aToHex } = require("@polkadot/util");
const {
  handleTeleportAssetDownwardMessage,
  handleTeleportAssets,
} = require("./xcm");
const { addAddress } = require("../utils/blockAddresses");

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
  const call = normalizeCall(extrinsic.method);
  let signer = extrinsic._raw.signature.get("signer").toString();
  //如果signer的解析长度不正确，则该交易是无签名交易
  if (signer.length < 47) {
    signer = "";
  }

  await handleTeleportAssetDownwardMessage(extrinsic, indexer);
  await handleTeleportAssets(extrinsic, indexer, signer);

  if (
    !(
      (call.section === "parachainSystem" &&
        call.method === "setValidationData") ||
      (call.section === "timestamp" && call.method === "set")
    )
  ) {
    if (signer) {
      addAddress(indexer.blockHeight, signer);
    }
  }
}

function normalizeCall(call) {
  const { section, method } = call;
  const callIndex = u8aToHex(call.callIndex);

  const args = [];
  for (let index = 0; index < call.args.length; index++) {
    let arg = call.args[index];

    const argMeta = call.meta.args[index];
    const name = argMeta.name.toString();
    const type = argMeta.type.toString();
    if (type === "Call" || type === "CallOf") {
      args.push([name, normalizeCall(arg)]);
      continue;
    }

    if (type === "Vec<Call>" || type === "Vec<CallOf>") {
      args.push([name, arg.map(normalizeCall)]);
      continue;
    }

    args.push([name, arg.toHuman()]);
  }

  return {
    callIndex,
    section,
    method,
    args: Object.fromEntries(args),
  };
}

module.exports = {
  handleExtrinsics,
};
