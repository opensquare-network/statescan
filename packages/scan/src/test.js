const dotenv = require('dotenv');
dotenv.config();

const { getApi } = require('./api');
const {calcFee} = require("./utils/fee");

async function main() {
  const api = await getApi();

  const blockHash = "0xf39ba618a7fac4ca95f4a26572e8de0386924d315830a689c7e8bd7c9afdadb4";
  const extrinsicIndex = 2;

  const block = await api.rpc.chain.getBlock(blockHash);
  const extrinsic = block.block.extrinsics[extrinsicIndex];

  const events = await api.query.system.events.at(block.block.hash);
  const [extrinsicSuccess] = events.filter((e) => {
    const { phase, event } = e;
    return !phase.isNull && phase.value.toNumber() === extrinsicIndex && event.method === "ExtrinsicSuccess";
  });
  if (extrinsicSuccess) {
    const dispatchInfo = extrinsicSuccess.event.data[0]?.toJSON();
    console.log(dispatchInfo);
    const blockApi = await api.at(blockHash);
    const fee = await calcFee(blockApi, extrinsic, dispatchInfo);
    console.log(fee);
  }

}

main();
