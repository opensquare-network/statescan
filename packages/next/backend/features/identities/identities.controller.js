const {
  getIdentityCollection,
} = require("../../mongo");

async function getIdentity(ctx) {
  const { chain, address } = ctx.params;

  const col = await getIdentityCollection(chain);
  const item = await col.findOne({ address });

  ctx.body = item;
}

module.exports = {
  getIdentity,
}
