const { fetchOneBlockFromNode } = require("./fetchBlocks");
const {
  test: { setupApi, disconnect },
} = require("@statescan/common");
jest.setTimeout(3000000);

describe("Get one block", () => {
  beforeAll(async () => {
    await setupApi();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("at height works", async () => {
    const height = 987619;
    const block = await fetchOneBlockFromNode(height, true);
    expect(block.author).toEqual(
      "EPk1wv1TvVFfsiG73YLuLAtGacfPmojyJKvmifobBzUTxFv"
    );
  });
});
