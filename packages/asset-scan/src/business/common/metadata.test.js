const { getAssetsMetadata } = require("./metadata");
const {
  getApi,
  test: { setupApi, disconnect },
} = require("@statescan/common");
jest.setTimeout(3000000);

describe("Get metadata", () => {
  beforeAll(async () => {
    await setupApi();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("works", async () => {
    const height = 954733;

    const api = await getApi();
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
