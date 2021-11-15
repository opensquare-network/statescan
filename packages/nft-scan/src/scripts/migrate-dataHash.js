const dotenv = require("dotenv");
dotenv.config();

const {
  getClassCollection,
  getInstanceCollection,
} = require("../mongo");

const { md5 } = require("../utils");

async function main() {
  const classCol = await getClassCollection();
  const instanceCol = await getInstanceCollection();
  for (const col of [classCol, instanceCol]) {
    const items = await col.find({ "metadata.data": { $ne: null } }).toArray();
    for (const item of items) {
      const dataHash = md5(item.metadata.data);
      await col.updateOne(
        { _id: item._id },
        { $set: { dataHash } }
      );
    }
  }
}

main().catch((err) => {}).finally(() => { process.exit(0); });