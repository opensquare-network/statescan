const { queryInstanceMetadata } = require("./metadata");
const {
  testConsts: { testTimeout },
  test: { setupApi, disconnect },
} = require("@statescan/common");
jest.setTimeout(testTimeout);

describe("Query class metadata", () => {
  beforeAll(async () => {
    await setupApi();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("of 0 works", async () => {
    const metadata = await queryInstanceMetadata(11, 67, {
      blockHeight: 1042231,
      blockHash:
        "0x9e41f37a44237c6ef31d8cf9c0b256e382f8ed86cfe4392d55dc7199a4d20341",
      blockTime: 1635264804443,
    });
    expect(metadata).toEqual({
      deposit: 6724999350,
      data: "0x516d5831687865414a644a7a336f4d6d6a6851435346424276395233517a455a5361676659443369434e4d526252",
      isFrozen: false,
    });
  });
});
