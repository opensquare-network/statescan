const { setApi } = require("../../../api");
const { findRegistry } = require("../../../specs");
const { setSpecHeights } = require("../../../specs");
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
    provider = new WsProvider("wss://pub.elara.patract.io/statemine", 1000);
    api = await ApiPromise.create({ provider });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("Extract", async () => {
    setSpecHeights([height]);
    const registry = await findRegistry(height);
    const block = new GenericBlock(registry, blockData.block);

    const calls = block.extrinsics.map(extrinsic => normalizeCall(extrinsic.method));
    expect(calls).toEqual(normalizeCallData);
  });
});
