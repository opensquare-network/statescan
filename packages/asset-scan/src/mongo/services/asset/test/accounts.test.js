const {
  getApi,
  test: { setupApi, disconnect },
} = require("@statescan/common");
const { getAssetAccounts } = require("../multipleAccounts");
jest.setTimeout(3000000);

describe("Query multiple accounts", () => {
  beforeAll(async () => {
    await setupApi();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("works", async () => {
    const blockHeight = 1441533;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);

    const accounts = [
      "DTpfcH3CBFgQjLbWm6dWkTDTcAKrK4kq9WhH6WjcjKqyAbo",
      "DQcegDuBQG6V99hgRd87UJ8anZxTcumJEVBAnAGomXCJ3dc",
    ];
    const indexer = {
      blockHeight,
      blockHash,
    };

    const result = await getAssetAccounts(8, accounts, indexer);
    expect(result).toEqual([
      {
        account: "DTpfcH3CBFgQjLbWm6dWkTDTcAKrK4kq9WhH6WjcjKqyAbo",
        info: {
          balance: "36001648000000000",
          isFrozen: false,
          isSufficient: false,
        },
      },
      {
        account: "DQcegDuBQG6V99hgRd87UJ8anZxTcumJEVBAnAGomXCJ3dc",
        info: {
          balance: "7588996763754045",
          isFrozen: false,
          isSufficient: false,
        },
      },
    ]);
  });
});
