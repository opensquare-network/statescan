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
  setApi,
  setProvider,
  specs: { setSpecHeights, findRegistry },
} = require("@statescan/common");
jest.setTimeout(3000000);

const { GenericBlock } = require("@polkadot/types");
const { ApiPromise, WsProvider } = require("@polkadot/api");

describe("Block", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(
      "wss://statemine.api.onfinality.io/public-ws",
      1000
    );
    api = await ApiPromise.create({ provider });
    setProvider(provider);
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
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
