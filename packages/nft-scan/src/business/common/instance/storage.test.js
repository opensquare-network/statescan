const {
  testConsts: { testTimeout },
} = require("@statescan/common");
const { queryInstanceDetails } = require("./storage");
const {
  test: { setupApi, disconnect },
} = require("@statescan/common");
jest.setTimeout(testTimeout);

describe("Query instance details", () => {
  beforeAll(async () => {
    await setupApi();
  });

  afterAll(async () => {
    await disconnect();
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
