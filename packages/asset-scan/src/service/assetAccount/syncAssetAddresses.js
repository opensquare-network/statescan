const { getAssetHolderCollection, getAssetCollection } = require("../../mongo");
const {
  getAssetAddresses,
  clearAssetAddresses,
} = require("../../business/common/store/blockAssetAddresses");
const { getAssetAccounts } = require("./multipleAccounts");
const {
  utils: { gt, toDecimal128 },
} = require("@statescan/common");

async function getAllToUpdateAssetAccounts(assetAddressesMap, indexer) {
  const allAssetAccounts = [];
  const assetCol = await getAssetCollection();
  for (const [assetIdKey, addrs] of Object.entries(assetAddressesMap)) {
    const assetId = parseInt(assetIdKey);
    const asset = await assetCol.findOne({
      assetId: assetId,
      destroyedAt: null,
    });

    if (!asset) {
      throw new Error(
        `can not find the asset ${assetId} when update holders at ${indexer.blockHeight}`
      );
    }

    const assetHeight = asset.createdAt.blockHeight;
    const assetAccounts = await getAssetAccounts(assetId, addrs, indexer);
    if (!assetAccounts) {
      return;
    }

    allAssetAccounts.push(
      ...assetAccounts.map((assetAccount) => {
        return {
          assetId,
          assetHeight,
          ...assetAccount,
        };
      })
    );
  }

  return allAssetAccounts;
}

async function queryAndSaveAssetAccountsToDb(indexer) {
  const assetAddressesMap = getAssetAddresses(indexer.blockHeight);
  if (!assetAddressesMap) {
    return;
  }

  const allAssetAccounts = await getAllToUpdateAssetAccounts(
    assetAddressesMap,
    indexer
  );
  if (allAssetAccounts.length < 1) {
    return;
  }

  const col = await getAssetHolderCollection();
  const bulk = col.initializeUnorderedBulkOp();

  for (const assetAccount of allAssetAccounts) {
    const {
      assetId,
      assetHeight,
      account,
      info: { balance },
    } = assetAccount;
    if (gt(balance, 0)) {
      bulk
        .find({ assetId, assetHeight, address: account })
        .upsert()
        .update({
          $set: {
            balance: toDecimal128(balance),
            ...assetAccount.info,
            lastUpdatedAt: indexer,
          },
        });
    } else {
      bulk.find({ assetId, assetHeight, address: account }).delete();
    }
  }

  await bulk.execute();
  clearAssetAddresses();
}

module.exports = {
  queryAndSaveAssetAccountsToDb,
};
