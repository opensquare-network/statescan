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
    ctx.body = [];
    return;
  }

  const assetCol = await getAssetCollection(chain);
  const addressCol = await getAddressCollection(chain);
  const blockCol = await getBlockCollection(chain);
  const extrinsicCol = await getExtrinsicCollection(chain);

  const [asset, address, block, extrinsic] = await Promise.all([
    assetCol.findOne({
      $or: [{ name: q }, { symbol: q }],
    }),
    addressCol.findOne({ address: q }),
    blockCol.findOne(
      {
        $or: [{ hash: q }, { "header.number": Number(q) }],
      },
      { projection: { extrinsics: 0 } }
    ),
    extrinsicCol.findOne({ hash: q }, { projection: { data: 0 } }),
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
    ctx.body = [];
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
