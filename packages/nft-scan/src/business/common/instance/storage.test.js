const { testTimeout } = require("../../../testCommon/constants");
const { queryInstanceDetails } = require("./storage");
const { setApi } = require("@statescan/utils");
const { elaraStatemine } = require("../../../testCommon/constants");
const { ApiPromise, WsProvider } = require("@polkadot/api");
jest.setTimeout(testTimeout);

describe("Query instance details", () => {
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

  test("of 0 works", async () => {
    const details = await queryInstanceDetails(0, 0, {
      blockHeight: 1041445,
      blockHash:
        "0xdd406b910cf6e06e2b1eaa647af93ef5bc05921286fe66a6d326547fd5c6ef0f",
      blockTime: 1635254226309,
    });
    expect(details).toEqual({
      owner: "D5pXehjCs7AYwLDQesuw8RQaEVydbHHc11erJKqhmeN7r7x",
      approved: null,
      isFrozen: false,
      deposit: 0,
    });
  });
});
