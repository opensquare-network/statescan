const {
  test: { setupApi, disconnect },
  specs: { findRegistry, setSpecHeights },
} = require("@statescan/common");
const { normalizeExtrinsics } = require("../extrinsic");
const {
  height,
  blockData,
  allEvents,
  block500001Extrinsics,
} = require("../../../testCommon/data");
jest.setTimeout(3000000);

const { GenericBlock } = require("@polkadot/types");

describe("Extrinsics", () => {
  beforeAll(async () => {
    await setupApi();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("Extract", async () => {
    await setSpecHeights([height]);
    const blockHash =
      "0x8abbad7ec531e2884647806b09dc710a07ee0c064d67c73b3f7c0c7188143f4b";
    const registry = await findRegistry({
      blockHeight: height,
      blockHash,
    });
    const block = new GenericBlock(registry, blockData.block);

    const blockEvents = registry.createType(
      "Vec<EventRecord>",
      allEvents,
      true
    );

    const indexer = { blockHeight: height, blockHash };
    const extrinsics = normalizeExtrinsics(
      block.extrinsics,
      blockEvents,
      indexer
    );
    expect(extrinsics).toEqual(block500001Extrinsics);
  });
});
