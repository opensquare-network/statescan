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
  const { chain } = ctx.params;
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

  const assetCol = await getAssetCollection(chain);
  const addressCol = await getAddressCollection(chain);
  const blockCol = await getBlockCollection(chain);
  const extrinsicCol = await getExtrinsicCollection(chain);

  const icaseQ = new RegExp(`^${escapeRegex(q)}$`, "i");

  const [asset, address, block, extrinsic] = await Promise.all([
    assetCol.findOne({
      $or: [
        { name: icaseQ },
        { symbol: icaseQ },
        ...(
          isNum
            ? [{ assetId: Number(q) }]
            : []
          )
      ],
    }),
    isAddr ? addressCol.findOne({ address: icaseQ }) : null,
    isNum
      ? blockCol.findOne(
          { "header.number": Number(q) },
          { projection: { extrinsics: 0 } }
        )
      : isHash
      ? blockCol.findOne({ hash: q }, { projection: { extrinsics: 0 } })
      : null,
    isHash
      ? extrinsicCol.findOne({ hash: q }, { projection: { data: 0 } })
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
  const { chain } = ctx.params;
  const { prefix } = ctx.query;

  if (!prefix) {
    ctx.body = {
      assets: [],
      addresses: [],
    };
    return;
  }

  const prefixPattern = new RegExp(`^${escapeRegex(prefix)}`, "i");
  const assetCol = await getAssetCollection(chain);
  const addressCol = await getAddressCollection(chain);

  const [assets, addresses] = await Promise.all([
    prefix.length >= 2
      ? assetCol
          .find({
            $or: [{ name: prefixPattern }, { symbol: prefixPattern }],
          })
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
  ]);

  ctx.body = {
    assets,
    addresses,
  };
}

module.exports = {
  search,
  searchAutoComplete,
};
