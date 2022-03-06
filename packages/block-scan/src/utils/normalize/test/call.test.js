const { findBlockHash } = require("../../../block/findBlockHash");
const {
  test: { setupApi, disconnect },
  specs: { findRegistry, setSpecHeights },
} = require("@statescan/common");
const {
  height,
  blockData,
  normalizeCallData,
} = require("../../../testCommon/data");
jest.setTimeout(3000000);

const { GenericBlock } = require("@polkadot/types");
const { normalizeCall } = require("../call");

describe("normalizeCall", () => {
  beforeAll(async () => {
    await setupApi();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("Extract", async () => {
    await setSpecHeights([height]);
    const blockHash = await findBlockHash(height);
    const registry = await findRegistry({
      blockHeight: height,
      blockHash,
    });
    const block = new GenericBlock(registry, blockData.block);

    const calls = block.extrinsics.map((extrinsic) =>
      normalizeCall(extrinsic.method)
    );
    expect(calls).toEqual(normalizeCallData);
  });
});
