const { testTimeout } = require("@statescan/nft-scan/src/testCommon/constants");
const { getBlockFromNode } = require("../fetchBlock");
const { setApi } = require("../../api");
const { ApiPromise, WsProvider } = require("@polkadot/api");
jest.setTimeout(testTimeout);

describe("Block", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://pub.elara.patract.io/statemine", 1000);
    api = await ApiPromise.create({ provider });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("fetch works", async () => {
    const height = 8888;
    const { block, events, author } = await getBlockFromNode(height);

    expect(author).toBeNull();
    expect(events).toHaveLength(1);
    expect(block.block.header.number.toNumber()).toEqual(height);
  });
});
