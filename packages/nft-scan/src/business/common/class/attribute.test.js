const { queryClassAttributeByHeight } = require("./attribute");
const { elaraWestmint, testTimeout } = require("../../../testCommon/constants");
const { setApi } = require("../../../api");
const { ApiPromise, WsProvider } = require("@polkadot/api");
jest.setTimeout(testTimeout);

describe("Query westmint class attribute", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(elaraWestmint, 1000);
    api = await ApiPromise.create({ provider });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("of 9527 works", async () => {
    const height = 841685;

    const metadata = await queryClassAttributeByHeight(9527, "0x01", height);
    expect(metadata).toEqual(["0x01", 100010000000]);
  });
});
