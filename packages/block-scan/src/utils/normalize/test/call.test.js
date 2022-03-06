const { findBlockHash } = require("../../../block/findBlockHash");
const {
  setApi,
  setProvider,
  specs: { findRegistry, setSpecHeights },
} = require("@statescan/common");
const {
  height,
  blockData,
  normalizeCallData,
} = require("../../../testCommon/data");
jest.setTimeout(3000000);

const { GenericBlock } = require("@polkadot/types");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { normalizeCall } = require("../call");

describe("normalizeCall", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(
      "wss://statemine.api.onfinality.io/public-ws",
      1000
    );
    api = await ApiPromise.create({ provider });
    setProvider(provider);
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
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
