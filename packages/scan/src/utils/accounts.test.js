const { getOnChainAccounts } = require("./getOnChainAccounts");
const { setApi } = require("../api");
const { ApiPromise, WsProvider } = require("@polkadot/api");
jest.setTimeout(3000000);

describe("Get onchain accounts", () => {
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
    const indexer = {
      blockHeight: 814850,
      blockHash:
        "0x1c4d57ac4a413e0fe279a4c4545215f6bf81092e38ac8963f45010b536943dc4",
    };

    const accounts = await getOnChainAccounts(indexer, [
      "CpjsLDC1JFyrhm3ftC9Gs4QoyrkHKhZKtK7YqGTRFtTafgp",
    ]);

    expect(accounts).toEqual([
      {
        address: "CpjsLDC1JFyrhm3ftC9Gs4QoyrkHKhZKtK7YqGTRFtTafgp",
        info: {
          nonce: 58,
          consumers: 4,
          providers: 1,
          sufficients: 0,
          data: {
            free: 65769267042479,
            reserved: 11073621663050,
            miscFrozen: 0,
            feeFrozen: 0,
          },
        },
      },
    ]);
  });
});
