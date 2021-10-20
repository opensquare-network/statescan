require("dotenv").config();

const { beginRoutineScan } = require("./scan/routine");
const { initDb } = require("./mongo");
const { subscribeFinalizedHeight } = require("./chain/finalizedHead");

async function main() {
  await initDb();
  await subscribeFinalizedHeight();

  await beginRoutineScan();
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(() => {
    //  todo: cleanup
  });
