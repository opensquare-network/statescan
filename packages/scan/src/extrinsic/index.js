const { extractExtrinsicEvents } = require("../utils");
const { getExtrinsicCollection } = require("../mongo");
const { isExtrinsicSuccess } = require("../utils");
const { u8aToHex } = require("@polkadot/util");
const {
  handleTeleportAssetDownwardMessage,
  handleTeleportAssets,
} = require("./xcm");
const asyncLocalStorage = require("../asynclocalstorage");
const { addAddress } = require("../utils/blockAddresses");

async function handleExtrinsics(extrinsics = [], allEvents = [], indexer) {
  let index = 0;
  for (const extrinsic of extrinsics) {
    const events = extractExtrinsicEvents(allEvents, index);

    await handleExtrinsic(
      extrinsic,
      {
        ...indexer,
        index: index++,
      },
      events
    );
  }
}

/**
 *
 * 解析并处理交易
 *
 */
async function handleExtrinsic(extrinsic, indexer, events) {
  const hash = extrinsic.hash.toHex();
  const call = normalizeCall(extrinsic.method);
  let signer = extrinsic._raw.signature.get("signer").toString();
  //如果signer的解析长度不正确，则该交易是无签名交易
  if (signer.length < 47) {
    signer = "";
  }

  const era = extrinsic.era?.toJSON();
  let lifetime = undefined;
  if (extrinsic.era?.isMortalEra) {
    const mortalEra = extrinsic.era.asMortalEra;
    lifetime = [
      mortalEra.birth(indexer.blockHeight),
      mortalEra.death(indexer.blockHeight),
    ];
  }
  const tip = extrinsic.tip?.toJSON();
  const nonce = extrinsic.nonce?.toJSON();
  const isSuccess = isExtrinsicSuccess(events);

  const version = extrinsic.version;
  const data = u8aToHex(extrinsic.data); // 原始数据

  const doc = {
    hash,
    indexer,
    signer,
    ...call,
    name: call.method,
    version,
    era,
    lifetime,
    tip,
    nonce,
    data,
    isSuccess,
  };

  const session = asyncLocalStorage.getStore();
  const exCol = await getExtrinsicCollection();
  const result = await exCol.insertOne(doc, { session });
  if (result.result && !result.result.ok) {
    // FIXME: 处理交易插入不成功的情况
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
