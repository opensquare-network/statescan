const { getAssetsApprovals } = require("./approvals");
const { setApi } = require("@statescan/common");
const { ApiPromise, WsProvider } = require("@polkadot/api");
jest.setTimeout(3000000);

describe("Get asset approvals", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(
      "wss://statemine.api.onfinality.io/public-ws",
      1000
    );
    api = await ApiPromise.create({ provider });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("works", async () => {
    const height = 832151;

    const blockHash = await api.rpc.chain.getBlockHash(height);
    const account = await getAssetsApprovals(
      blockHash,
      36,
      "FG8u2HSdf5W4HZcXmPDSTMSGifK3ZjzJSxbH6v1qgtSkepq",
      "GDGCzxSoGgwr4UoPQrteKVBkHs7aHjzCPxEA2NS14hKgRXC"
    );

    expect(account).toEqual({
      amount: 10,
      deposit: 3333333,
    });
  });
});
