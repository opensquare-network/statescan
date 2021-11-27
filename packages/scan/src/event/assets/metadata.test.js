const { getAssetsMetadata } = require("./metadata");
const { setApi } = require("@statescan/utils");
const { ApiPromise, WsProvider } = require("@polkadot/api");
jest.setTimeout(3000000);

describe("Get asset", () => {
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

  test("works", async () => {
    const height = 954733;

    const blockHash = await api.rpc.chain.getBlockHash(height);
    const account = await getAssetsMetadata(blockHash, 8);

    expect(account).toEqual({
      deposit: 6693333000,
      name: "0x524d524b2e617070",
      symbol: "0x524d524b",
      decimals: 10,
      isFrozen: false,
    });
  });
});
