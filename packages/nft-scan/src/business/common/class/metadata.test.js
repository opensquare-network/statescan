const { queryClassMetadataByHeight } = require("./metadata");
const { setApi } = require("@statescan/common");
const {
  testConsts: { elaraStatemine, testTimeout },
} = require("@statescan/common");
const { ApiPromise, WsProvider } = require("@polkadot/api");
jest.setTimeout(testTimeout);

describe("Query class metadata", () => {
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
    const height = 338600;

    const metadata = await queryClassMetadataByHeight(0, height);
    expect(metadata).toEqual({
      deposit: 0,
      data: "0x516d626552624d65436571385374625550504e7171554e3663657663464e665066453538545638756b6d694b6b52",
      isFrozen: false,
    });

    const preHeight = 338599;
    const preMetadata = await queryClassMetadataByHeight(0, preHeight);
    expect(preMetadata).toBeNull();
  });
});
