/**
 * This script is used to update the approval manually by providing asset id, owner and delegate.
 * Example:
 *  rescan-approvals.js --assetId=5 --owner=FvokLqZ9DqT67pukJWWWbEi5kvCkjyCoTvhw4RwUJFgpQXn --delegate=EkpakfsFiVEzx5DMGiJ5eNa5VDCdwTk4NrPKkPxUnGXbUQR
 */

const dotenv = require("dotenv");
dotenv.config();

const minimist = require("minimist");
const { getApi, getBlockIndexer } = require("@statescan/common");
const { updateOrCreateApproval } = require("../event/assets/db");

async function main() {
  const args = minimist(process.argv.slice(2));

  if (!args.assetId) {
    console.log("--assetId=[assetId] is not provided");
    process.exit(0);
  }

  if (!args.owner) {
    console.log("--owner=[owner] is not provided");
    process.exit(0);
  }

  if (!args.delegate) {
    console.log("--delegate=[delegate] is not provided");
    process.exit(0);
  }

  const assetId = parseInt(args.assetId);
  const owner = args.owner;
  const delegate = args.delegate;

  const api = await getApi();
  const blockHash = await api.rpc.chain.getFinalizedHead();
  const block = await api.rpc.chain.getBlock(blockHash);
  const blockIndexer = getBlockIndexer(block.block);

  await updateOrCreateApproval(blockIndexer, assetId, owner, delegate);
}

main()
  .catch(console.error)
  .then(() => process.exit(0));
