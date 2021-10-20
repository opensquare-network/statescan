const { HttpError } = require("../../exc");
const {
  getAssetCollection,
  getAddressCollection,
  getBlockCollection,
  getExtrinsicCollection,
} = require("../../mongo");

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

async function search(ctx) {
  const { q } = ctx.query;

  if (!q) {
    ctx.body = {
      asset: null,
      address: null,
      block: null,
      extrinsic: null,
    };
    return;
  }

  const lowerQ = q.toLowerCase();
  const isHash = !!lowerQ.match(/^0x[0-9a-f]{64}$/);
  const isNum = q.match(/^[0-9]+$/);
  const isAddr = q.match(/^[0-9a-zA-Z]{47,48}$/);

  const assetCol = await getAssetCollection();
  const addressCol = await getAddressCollection();
  const blockCol = await getBlockCollection();
  const extrinsicCol = await getExtrinsicCollection();

  const icaseQ = new RegExp(`^${escapeRegex(q)}$`, "i");

  const [asset, address, block, extrinsic] = await Promise.all([
    assetCol.findOne(
      {
        $or: [
          { name: icaseQ },
          { symbol: icaseQ },
          ...(isNum ? [{ assetId: Number(q) }] : []),
        ],
      },
      { projection: { timeline: 0 } }
    ),
    isAddr ? addressCol.findOne({ address: icaseQ }) : null,
    isNum
      ? blockCol.findOne(
          { "header.number": Number(q) },
          { projection: { extrinsics: 0 } }
        )
      : isHash
      ? blockCol.findOne(
          { hash: lowerQ },
          { projection: { extrinsics: 0 } }
        )
      : null,
    isHash
      ? extrinsicCol.findOne(
          { hash: lowerQ },
          { projection: { data: 0 } }
        )
      : null,
  ]);

  ctx.body = {
    asset,
    address,
    block,
    extrinsic,
  };
}

async function searchAutoComplete(ctx) {
  const { prefix } = ctx.query;

  if (!prefix) {
    ctx.body = {
      assets: [],
      addresses: [],
      blocks: [],
    };
    return;
  }

  const lowerQ = prefix.toLowerCase();
  const isHash = !!lowerQ.match(/^0x[0-9a-f]{6,64}$/);
  const isNum = prefix.match(/^[0-9]+$/);

  const assetCol = await getAssetCollection();
  const addressCol = await getAddressCollection();
  const blockCol = await getBlockCollection();

  const prefixPattern = new RegExp(`^${escapeRegex(lowerQ)}`, "i");

  const [assets, addresses, blocks] = await Promise.all([
    prefix.length >= 2
      ? assetCol.find(
          {
            $or: [
              { name: prefixPattern },
              { symbol: prefixPattern },
              ...(isNum ? [{ assetId: Number(prefix) }] : []),
            ],
          },
          { projection: { timeline: 0 } }
        )
        .sort({ name: 1 })
        .limit(10)
        .toArray()
      : [],
    prefix.length >= 4
      ? addressCol
          .find({ address: prefixPattern })
          .sort({ address: 1 })
          .limit(10)
          .toArray()
      : [],
    isNum
      ? blockCol.find(
          { "header.number": Number(prefix) },
          { projection: { extrinsics: 0 } }
        ).toArray()
      : isHash
      ? blockCol.find(
          { hash: prefixPattern },
          { projection: { extrinsics: 0 } }
        ).toArray()
      : [],
  ]);

  ctx.body = {
    assets,
    addresses,
    blocks,
  };
}

module.exports = {
  search,
  searchAutoComplete,
};
