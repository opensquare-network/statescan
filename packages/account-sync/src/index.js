require("dotenv").config();

const { getApi } = require("@statescan/common");
const { u8aToHex } = require("@polkadot/util");
const { normalizeEntry } = require("./normalization");

async function main() {
  const api = await getApi();

  let startKey = null;
  let entries = [];

  do {
    entries = await api.query.system.account.entriesPaged({
      args: [],
      pageSize: 500,
      startKey,
    });

    if (entries.length < 1) {
      return;
    }

    startKey = u8aToHex(entries[entries.length - 1][0]);

    const normalizedArr = entries.map(normalizeEntry);
    console.log(normalizedArr);
  } while (entries.length > 1);
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error);
