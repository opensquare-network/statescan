require("dotenv").config();

const { getOnChainAccounts } = require("./chain/account/getOnChainAccounts");
const { closeDb } = require("./mongo");
const { getAddressCollection, getRawAddressCollection } = require("./mongo");
const {
  logger,
  utils: { bigAdd, toDecimal128 },
  disconnect,
  sleep,
} = require("@statescan/common");

async function getNotUpdatedAddresses() {
  const col = await getRawAddressCollection();
  const addrObjs = await col.find({ updated: false }).limit(500).toArray();
  return (addrObjs || []).map((obj) => obj.address);
}

async function updateAddresses(addrs = []) {
  if (addrs.length <= 0) {
    return;
  }

  const accounts = (await getOnChainAccounts(addrs)) || [];
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

// This script get and update the raw address to db
async function oneStep() {
  let total = 0;

  while (true) {
    const addrs = await getNotUpdatedAddresses();
    if (addrs.length < 1) {
      break;
    }

    await updateAddresses(addrs);
  }

  logger.info(`${total} addrs updated`);
}

async function main() {
  const intervalId = setInterval(oneStep, 6000);

  await sleep(60 * 1000);
  clearInterval(intervalId);
  await disconnect();
  await closeDb();
}

main()
  .then(() => console.log("Raw addresses finished"))
  .catch(console.error);
