const { getApi } = require("../api");
const { updateHeight, getLatestFinalizedHeight } = require("../chain");

async function main() {
  const myArgs = process.argv.slice(2);
  if ((myArgs || []).length <= 0) {
    console.error("Please specify the block height");
    process.exit(1);
  }

  const arg1 = myArgs[0];
  const height = parseInt(arg1);
  if (isNaN(height)) {
    console.error("Wrong block height");
    process.exit(1);
  }

  await updateHeight();
  const api = await getApi();
  const finalizedHeight = getLatestFinalizedHeight();
  if (height > finalizedHeight) {
    console.error("Block height can not be greater than the finalized height");
    await api.provider.disconnect();
    process.exit(1);
  }
}

main().catch(console.error);
