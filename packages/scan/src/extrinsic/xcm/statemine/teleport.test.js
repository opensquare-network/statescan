const { extractTeleportAssetsFromExtrinsic } = require("../index");
const { setApi } = require("@statescan/utils");
const { ApiPromise, WsProvider } = require("@polkadot/api");
jest.setTimeout(3000000);

async function testTeleportAsset(api, height, extrinsicIndex, target) {
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);

  const extrinsic = block.block.extrinsics[extrinsicIndex];

  const extracted = extractTeleportAssetsFromExtrinsic(extrinsic);
  expect(extracted).toEqual(target);
}

describe("statemine XCM", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(
      "wss://statemine.api.onfinality.io/public-ws",
      1000
    );
    api = await ApiPromise.create({ provider });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("teleport assets parser works", async () => {
    const items = [
      [
        917004,
        2,
        {
          isSupported: true,
          hasFungible: true,
          data: {
            beneficiary: "GUJXsnLf8iPKXLnyrjF6ksVhVtUjQC26Sftr3o1x38kmUjP",
            amount: "250000000000",
          },
        },
      ],
      [
        941884,
        2,
        {
          isSupported: true,
          hasFungible: true,
          data: {
            beneficiary: "FrFh2N5J2Cir7BwonNzudBXzHqhCEfAfz5RQ1yCKvQxrHNJ",
            amount: "10000000000",
          },
        },
      ],
    ];

    for (const item of items) {
      await testTeleportAsset(api, ...item);
    }
  });
});
