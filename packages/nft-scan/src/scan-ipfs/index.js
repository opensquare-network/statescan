const dotenv = require('dotenv');
dotenv.config();

const {
  getClassCollection,
  getInstanceCollection,
} = require("../mongo");
const { scanMeta } = require('./utils');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  while (true) {
    const classCol = await getClassCollection();
    const instanceCol = await getInstanceCollection();
    const nftClass = await classCol.findOne({ metadata: { $ne: null }, recognized: null });
    const nftInstance = await instanceCol.findOne({ metadata: { $ne: null }, recognized: null });
    if (nftClass) {
      await scanMeta(classCol, nftClass);
    }
    if (nftInstance) {
      await scanMeta(instanceCol, nftInstance);
    }
    await sleep(5000);
  }
}

main().catch(console.error).then(() => {
  process.exit(0);
});
