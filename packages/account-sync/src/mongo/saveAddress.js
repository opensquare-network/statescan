const {
  utils: { bigAdd, toDecimal128 },
} = require("@statescan/common");
const { getAddressCollection } = require("./index");

async function bulkSaveNormalizedAccounts(normalizedAccounts = []) {
  if (normalizedAccounts.length < 1) {
    return;
  }

  const col = await getAddressCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const { addr, detail } of normalizedAccounts) {
    const data = normalizeData(detail.data);
    bulk
      .find({ address: addr })
      .upsert()
      .updateOne({
        $set: {
          ...detail,
          data,
        },
      });
  }

  await bulk.execute();
}

function normalizeData(accountData) {
  const { free, reserved, miscFrozen, feeFrozen } = accountData;
  const total = bigAdd(free, reserved);

  return {
    total: toDecimal128(total),
    free: toDecimal128(free),
    reserved: toDecimal128(reserved),
    miscFrozen: toDecimal128(miscFrozen),
    feeFrozen: toDecimal128(feeFrozen),
  };
}

module.exports = {
  bulkSaveNormalizedAccounts,
};
