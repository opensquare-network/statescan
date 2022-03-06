const { getAssetsApprovals } = require("./approvals");
const {
  getApi,
  test: { setupApi, disconnect },
} = require("@statescan/common");
jest.setTimeout(3000000);

describe("Get asset approvals", () => {
  beforeAll(async () => {
    await setupApi();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("works", async () => {
    const height = 832151;

    const api = await getApi();
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
