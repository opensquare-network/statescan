const { getAssetsAsset } = require("./assetStorage");
const {
  getApi,
  test: { setupApi, disconnect },
} = require("@statescan/common");
jest.setTimeout(3000000);

describe("Get asset", () => {
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
    const account = await getAssetsAsset(blockHash, 8);

    expect(account).toEqual({
      owner: "HKKT5DjFaUE339m7ZWS2yutjecbUpBcDQZHw2EF7SFqSFJH",
      issuer: "CpjsLDC1JFyrhm3ftC9Gs4QoyrkHKhZKtK7YqGTRFtTafgp",
      admin: "CpjsLDC1JFyrhm3ftC9Gs4QoyrkHKhZKtK7YqGTRFtTafgp",
      freezer: "CpjsLDC1JFyrhm3ftC9Gs4QoyrkHKhZKtK7YqGTRFtTafgp",
      supply: "0x0000000000000000016345785d8a0000",
      deposit: 1000000000000,
      minBalance: 100000,
      isSufficient: false,
      accounts: 1914,
      sufficients: 0,
      approvals: 0,
      isFrozen: false,
    });
  });
});
