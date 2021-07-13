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

  const assetCol = await getAssetCollection(chain);
  const addressCol = await getAddressCollection(chain);
  const blockCol = await getBlockCollection(chain);
  const extrinsicCol = await getExtrinsicCollection(chain);

  const icaseQ = new RegExp(`^${escapeRegex(q)}$`, "i");

  const [asset, address, block, extrinsic] = await Promise.all([
    assetCol.findOne({
      $or: [{ name: icaseQ }, { symbol: icaseQ }],
    }),
    addressCol.findOne({ address: icaseQ }),
    blockCol.findOne(
      {
        $or: [{ hash: icaseQ }, { "header.number": Number(q) }],
      },
      { projection: { extrinsics: 0 } }
    ),
    extrinsicCol.findOne({ hash: icaseQ }, { projection: { data: 0 } }),
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
