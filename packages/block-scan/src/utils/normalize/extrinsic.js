const { ignoreInExtrinsicList } = require("../checkSystem");
const { normalizeCall } = require("./call");
const { isExtrinsicSuccess, extractExtrinsicEvents } = require("../index");
const { u8aToHex } = require("@polkadot/util");

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

  const listIgnore = ignoreInExtrinsicList(extrinsic.method);

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
    listIgnore,
  };
}

function normalizeExtrinsics(extrinsics = [], events = [], blockIndexer) {
  return extrinsics.map((extrinsic, index) => {
    const extrinsicIndexer = {
      ...blockIndexer,
      index,
    };

    const extrinsicEvents = extractExtrinsicEvents(events, index);
    return normalizeExtrinsic(extrinsic, extrinsicEvents, extrinsicIndexer);
  });
}

module.exports = {
  normalizeExtrinsics,
};
