const dotenv = require("dotenv");
dotenv.config();

const { initDb } = require("./mongo");
const {
  chainHeight: { subscribeFinalizedHead },
} = require("@statescan/common");

async function main() {
  await initDb();
  await subscribeFinalizedHead();
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)
  .finally(() => {
    //  todo: cleanup
  });
