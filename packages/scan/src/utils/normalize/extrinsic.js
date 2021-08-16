const { isExtrinsicSuccess, extractExtrinsicEvents } = require("../index");
const { u8aToHex } = require("@polkadot/util");

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

function normalizeExtrinsic(extrinsic, events, extrinsicIndexer) {
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
      mortalEra.birth(extrinsicIndexer.blockHeight),
      mortalEra.death(extrinsicIndexer.blockHeight),
    ];
  }
  const tip = extrinsic.tip?.toJSON();
  const nonce = extrinsic.nonce?.toJSON();
  const isSuccess = isExtrinsicSuccess(events);

  const version = extrinsic.version;
  const data = u8aToHex(extrinsic.data); // 原始数据

  return {
    hash,
    indexer: extrinsicIndexer,
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
}

function normalizeExtrinsics(extrinsics = [], events = [], blockIndexer) {
  return extrinsics.reduce((result, extrinsic, index) => {
    const extrinsicIndexer = {
      ...blockIndexer,
      index,
    };

    const extrinsicEvents = extractExtrinsicEvents(events, index);
    const normalizedExtrinsic = normalizeExtrinsic(
      extrinsic,
      extrinsicEvents,
      extrinsicIndexer
    );
    return [...result, normalizedExtrinsic];
  }, []);
}

module.exports = {
  normalizeExtrinsics,
};
