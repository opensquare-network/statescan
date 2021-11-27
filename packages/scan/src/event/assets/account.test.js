const { getAssetsAccount } = require("./accountStorage");
const { setApi } = require("@statescan/utils");
const { ApiPromise, WsProvider } = require("@polkadot/api");
jest.setTimeout(3000000);

describe("Get asset account", () => {
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
    const address = "CpjsLDC1JFyrhm3ftC9Gs4QoyrkHKhZKtK7YqGTRFtTafgp";

    const blockHash = await api.rpc.chain.getBlockHash(height);
    const account = await getAssetsAccount(blockHash, 8, address);

    expect(account).toEqual({
      balance: 337102866288025,
      isFrozen: false,
      isSufficient: false,
    });
  });
});
