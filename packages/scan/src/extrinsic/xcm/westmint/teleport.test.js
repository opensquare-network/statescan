const { extractTeleportAssetsFromExtrinsic } = require("../index");
const { setApi } = require("@statescan/common");
const { ApiPromise, WsProvider } = require("@polkadot/api");
jest.setTimeout(3000000);

async function testTeleportAsset(api, height, extrinsicIndex, target) {
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);

  const extrinsic = block.block.extrinsics[extrinsicIndex];

  const extracted = extractTeleportAssetsFromExtrinsic(extrinsic);
  expect(extracted).toEqual(target);
}

describe("westmint XCM", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://pub.elara.patract.io/westmint", 1000);
    api = await ApiPromise.create({ provider });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("teleport assets parser works", async () => {
    const items = [
      [
        11888,
        2,
        {
          isSupported: true,
          hasFungible: false,
          data: {
            beneficiary: "5E581JKJpmbeNAebdTbWH97JdE9pef3r8CRPachWzGBDicvi",
            amount: "0",
          },
        },
      ],
      [
        422066,
        2,
        {
          isSupported: true,
          hasFungible: true,
          data: {
            beneficiary: "5DJGuRBBMVmtD94ftSznw2hQqSEhEQ2g8EQcpPbBANsJKLdv",
            amount: "1000000000000",
          },
        },
      ],
    ];

    for (const item of items) {
      await testTeleportAsset(api, ...item);
    }
  });
});
