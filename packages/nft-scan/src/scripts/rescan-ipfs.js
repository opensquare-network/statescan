const dotenv = require("dotenv");
dotenv.config();

const minimist = require("minimist");
const { scanMeta } = require("../scan-ipfs/utils");
const {
  getClassCollection,
  getInstanceCollection,
} = require("../mongo");

async function scanInstance(classId, instanceId) {
  console.log(`Re-scan instance data from IPFS for`, classId, instanceId);
  const instanceCol = await getInstanceCollection();
  const nftInstance = await instanceCol.findOne({ classId, instanceId }, {
    sort: {
      classHeight: -1,
      "indexer.blockHeight": -1
    }
  });
  if (!nftInstance) {
    console.log(`Instance ${instanceId} not found`);
    process.exit(0);
  }
  console.log(`Re-scan instance object`, nftInstance._id);
  await scanMeta(instanceCol, nftInstance);
}

async function scanClass(classId) {
  console.log(`Re-scan class data from IPFS for`, classId);
  const classCol = await getClassCollection();
  const nftClass = await classCol.findOne({ classId }, { sort: { "indexer.blockHeight": -1 } });
  if (!nftClass) {
    console.log(`Class ${classId} not found`);
    process.exit(0);
  }
  console.log(`Re-scan class object`, nftClass._id);
  await scanMeta(classCol, nftClass);
}

async function main() {
  const args = minimist(process.argv.slice(2));

  if (!args.classId) {
    console.log("--classId=[classId] is not provided");
    process.exit(0);
  }

  const classId = parseInt(args.classId);
  const instanceId = parseInt(args.instanceId);

  if (instanceId) {
    await scanInstance(classId, instanceId);
  } else {
    await scanClass(classId);
  }
}

main().catch(console.error).then(() => process.exit(0));
