const { findBlockHash } = require("../findBlockHash");
const {
  height,
  blockData,
  extractedBlock,
  author,
  allEvents,
} = require("../../testCommon/data");
const { extractBlock } = require("../index");
const {
  test: { setupApi, disconnect },
  specs: { setSpecHeights, findRegistry },
} = require("@statescan/common");
jest.setTimeout(3000000);

const { GenericBlock } = require("@polkadot/types");

describe("Block", () => {
  beforeAll(async () => {
    await setupApi();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("Extract", async () => {
    await setSpecHeights([height]);
    const blockHash = await findBlockHash(height);
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

    const normalized = extractBlock(block, blockEvents, author);
    expect(normalized).toEqual(extractedBlock);
  });
});
