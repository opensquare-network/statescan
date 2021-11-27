require("dotenv").config();

const { beginRoutineScan } = require("./scan/routine");
const { initDb } = require("./mongo");
const {
  chainHeight: { updateHeight: subscribeFinalizedHeight },
} = require("@statescan/utils");

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
