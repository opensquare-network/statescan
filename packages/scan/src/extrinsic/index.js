const { extractExtrinsicEvents, getExtrinsicSigner } = require("../utils");
const { getExtrinsicCollection } = require("../mongo");
const { isExtrinsicSuccess } = require("../utils");
const { u8aToHex } = require("@polkadot/util");
const { handleTeleportAssetDownwardMessage, handleTeleportAssets } = require("./xcm");

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
  const callIndex = u8aToHex(extrinsic.callIndex);
  const { args } = extrinsic.method.toJSON();
  const name = extrinsic.method.method;
  const section = extrinsic.method.section;
  let signer = extrinsic._raw.signature.get("signer").toString();
  //如果signer的解析长度不正确，则该交易是无签名交易
  if (signer.length < 48) {
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
    section,
    name,
    callIndex,
    version,
    args,
    era,
    lifetime,
    tip,
    nonce,
    data,
    isSuccess,
  };

  const exCol = await getExtrinsicCollection();
  const result = await exCol.insertOne(doc);
  if (result.result && !result.result.ok) {
    // FIXME: 处理交易插入不成功的情况
  }

  await handleTeleportAssetDownwardMessage(extrinsic, indexer);
  await handleTeleportAssets(extrinsic, indexer);
}

function normalizeExtrinsic(extrinsic, events) {
  if (!extrinsic) {
    throw new Error("Invalid extrinsic object");
  }

  const hash = extrinsic.hash.toHex();
  const callIndex = u8aToHex(extrinsic.callIndex);
  const { args } = extrinsic.method.toJSON();
  const name = extrinsic.method.method;
  const section = extrinsic.method.section;
  const signer = getExtrinsicSigner(extrinsic);

  const isSuccess = isExtrinsicSuccess(events);

  const version = extrinsic.version;
  const data = u8aToHex(extrinsic.data); // 原始数据

  return {
    hash,
    signer,
    section,
    name,
    callIndex,
    version,
    args,
    data,
    isSuccess,
  };
}

module.exports = {
  handleExtrinsics,
  normalizeExtrinsic,
};
