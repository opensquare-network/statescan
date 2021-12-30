require("dotenv").config();

const { closeDb } = require("./mongo");
const { getApi, disconnect, logger } = require("@statescan/common");
const { u8aToHex } = require("@polkadot/util");
const { normalizeEntry } = require("./normalization");
const { bulkSaveNormalizedAccounts } = require("./mongo/saveAddress");

let total = 0;

async function queryEntries(startKey) {
  const api = await getApi();

  return api.query.system.account.entriesPaged({
    args: [],
    pageSize: 1000,
    startKey,
  });
}

async function main() {
  let startKey = null;
  let entries = await queryEntries(startKey);

  while (entries.length > 0) {
    startKey = u8aToHex(entries[entries.length - 1][0]);
    const normalizedArr = entries.map(normalizeEntry);
    await bulkSaveNormalizedAccounts(normalizedArr);
    logger.info(`${entries.length} accounts saved!`);
    total += entries.length;

    entries = await queryEntries(startKey);
  }
  logger.info(`account updated, total ${total}`);
  await disconnect();
  await closeDb();
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error);
