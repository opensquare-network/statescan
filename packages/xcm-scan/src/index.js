const dotenv = require("dotenv");
dotenv.config();

const { initDb } = require("./mongo");
const {
  chainHeight: { subscribeFinalizedHead },
} = require("@statescan/common");
const { beginScan } = require("./scan");

async function main() {
  await initDb();
  await subscribeFinalizedHead();

  await beginScan();
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(() => {
    //  todo: cleanup
  });
