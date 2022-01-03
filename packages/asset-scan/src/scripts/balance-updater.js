const dotenv = require("dotenv");
dotenv.config();

const {
  logger,
  getBlockIndexer,
  env: { getUpdateAddrStep },
} = require("@statescan/common");
const { toDecimal128, bigAdd } = require("../utils");
const { getOnChainAccounts } = require("../utils/getOnChainAccounts");
const {
  getRawAddressCollection,
  getAddressCollection,
  getStatusCollection,
} = require("../mongo");
const { getBlockByHeight } = require("../utils/getBlockIndexer");

async function getNextPageAddresses(mongoId) {
  const updateAddrStep = getUpdateAddrStep();
  const col = await getRawAddressCollection();
  const addrObjs = await col
    .find(
      mongoId
        ? {
            _id: {
              $gt: mongoId,
            },
          }
        : {}
    )
    .sort({ _id: 1 })
    .limit(updateAddrStep)
    .toArray();
  return addrObjs;
}

async function updateAddresses(indexer, addrs = []) {
  if (addrs.length <= 0) {
    return;
  }

  const accounts = await getOnChainAccounts(indexer, addrs);
  if (accounts.length <= 0) {
    throw new Error("Can not get on chain accounts from given addrs");
  }

  const col = await getAddressCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const account of accounts) {
    const total = bigAdd(
      account.info.data.free || 0,
      account.info.data.reserved || 0
    );
    bulk
      .find({ address: account.address })
      .upsert()
      .updateOne({
        $set: {
          ...account.info,
          data: {
            free: toDecimal128(account.info.data.free),
            reserved: toDecimal128(account.info.data.reserved),
            miscFrozen: toDecimal128(account.info.data.miscFrozen),
            feeFrozen: toDecimal128(account.info.data.feeFrozen),
            total: toDecimal128(total),
          },
          lastUpdatedAt: indexer,
        },
      });
  }

  await bulk.execute();

  const rawCol = await getRawAddressCollection();
  const rawBulk = rawCol.initializeUnorderedBulkOp();
  for (const addr of addrs) {
    rawBulk.find({ address: addr }).updateOne({ $set: { updated: true } });
  }
  await rawBulk.execute();
}

async function updateAllRawAddrsInDB(indexer) {
  let lastId = null;

  while (true) {
    let addrObjs = await getNextPageAddresses(lastId);
    if (addrObjs.length === 0) {
      break;
    }

    lastId = addrObjs[addrObjs.length - 1]._id;

    const addrs = (addrObjs || []).map((obj) => obj.address);
    await updateAddresses(indexer, addrs);
    logger.info(
      `${(addrs || []).length} addrs updated at ${indexer.blockHeight}`
    );
  }
}

async function main() {
  const statusCol = await getStatusCollection();
  const heightInfo = await statusCol.findOne({ name: "main-scan-height" });
  if (!heightInfo) {
    return;
  }

  let scanFinalizedHeight = heightInfo.value;

  const block = await getBlockByHeight(scanFinalizedHeight);
  const blockIndexer = getBlockIndexer(block.block);

  try {
    await updateAllRawAddrsInDB(blockIndexer);
  } catch (e) {
    logger.error("error when updateAllRawAddrsInDB", e);
  }
}

main()
  .catch(console.error)
  .then(() => process.exit(0));
