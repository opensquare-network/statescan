const { getBlockIndexer } = require("../../block/getBlockIndexer");
const { extractTeleportFromOneMsg } = require("./index");
const { block66710 } = require("../../testCommon/block66710");
const { GenericBlock } = require("@polkadot/types");
const { setSpecHeights, findRegistry } = require("../../specs");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { setApi } = require("../../api");
jest.setTimeout(3000000);

describe("XCM", () => {
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

  test("teleport works", async () => {
    const height = 66710;
    setSpecHeights([height]);

    const registry = await findRegistry(height);
    const block = new GenericBlock(registry, block66710.block.block);

    const setValidationDataExtrinsic = block.extrinsics[0];
    const {
      args: [{ downwardMessages }],
    } = setValidationDataExtrinsic;

    expect(downwardMessages.length).toBe(1);
    const message = downwardMessages[0];
    const blockIndexer = getBlockIndexer(block);
    const extrinsicHash = setValidationDataExtrinsic.hash.toHex();
    const extrinsicIndexer = {
      ...blockIndexer,
      index: 0,
    };
    const extracted = extractTeleportFromOneMsg(
      registry,
      message,
      extrinsicIndexer,
      extrinsicHash
    );
    expect(extracted).toEqual({
      indexer: {
        blockHeight: 66710,
        blockHash:
          "0xdaf753c144fdd7ab1dc9f2ad8aa9d7e09040ad9125f4af1cb331bf68bebca0b9",
        blockTime: 1622737140406,
        index: 0,
      },
      extrinsicHash:
        "0x8b517897ada88924601e0c9121b7225921e3e3464b826548a2f62cb8d44f716b",
      teleportDirection: "in",
      messageId:
        "0x77986a85231854e46928791b4cea1bd8061eafb1383faca71245696266dfcd40",
      pubSentAt: 7755562,
      teleportAsset: {
        assets: [
          {
            concreteFungible: {
              id: {
                x1: {
                  parent: null,
                },
              },
              amount: 100000000000,
            },
          },
        ],
        effects: [
          {
            buyExecution: {
              fees: {
                all: null,
              },
              weight: 0,
              debt: 30000000,
              haltOnError: false,
              xcm: [],
            },
          },
          {
            depositAsset: {
              assets: [
                {
                  all: null,
                },
              ],
              dest: {
                x1: {
                  accountId32: {
                    network: {
                      any: null,
                    },
                    id: "GcDZZCVPwkPqoWxx8vfLb4Yfpz9yQ1f4XEyqngSH8ygsL9p",
                  },
                },
              },
            },
          },
        ],
      },
      beneficiary: "GcDZZCVPwkPqoWxx8vfLb4Yfpz9yQ1f4XEyqngSH8ygsL9p",
      amount: 100000000000,
      fee: 30000000,
    });
  });
});
