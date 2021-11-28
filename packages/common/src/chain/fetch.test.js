const { setApi } = require("../api");
const { elaraStatemine } = require("../testCommon/constants");
const { fetchOneBlockFromNode } = require("./fetchBlocks");
const { ApiPromise, WsProvider } = require("@polkadot/api");
jest.setTimeout(3000000);

describe("Get one block", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(elaraStatemine, 1000);
    api = await ApiPromise.create({ provider });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("at height works", async () => {
    const height = 987619;
    const block = await fetchOneBlockFromNode(height, true);
    expect(block.author).toEqual(
      "EPk1wv1TvVFfsiG73YLuLAtGacfPmojyJKvmifobBzUTxFv"
    );
  });
});
