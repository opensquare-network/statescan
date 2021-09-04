const { setApi } = require("../../../api");
const { findRegistry } = require("../../../specs");
const { setSpecHeights } = require("../../../specs");
const { normalizeExtrinsics } = require("../extrinsic");
const {
  height,
  blockData,
  allEvents,
  block500001Extrinsics,
} = require("../../../testCommon/data");
jest.setTimeout(3000000);

const { GenericBlock } = require("@polkadot/types");
const { ApiPromise, WsProvider } = require("@polkadot/api");

describe("Extrinsics", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://statemine.kusama.elara.patract.io/", 1000);
    api = await ApiPromise.create({ provider });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("Extract", async () => {
    setSpecHeights([height]);
    const registry = await findRegistry(height);
    const block = new GenericBlock(registry, blockData.block);

    const blockEvents = registry.createType(
      "Vec<EventRecord>",
      allEvents,
      true
    );

    const blockHash =
      "0x8abbad7ec531e2884647806b09dc710a07ee0c064d67c73b3f7c0c7188143f4b";
    const indexer = { blockHeight: height, blockHash };
    const extrinsics = normalizeExtrinsics(
      block.extrinsics,
      blockEvents,
      indexer
    );
    expect(extrinsics).toEqual(block500001Extrinsics);
  });
});
