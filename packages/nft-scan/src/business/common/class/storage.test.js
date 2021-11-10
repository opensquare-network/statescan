const { testTimeout } = require("../../../testCommon/constants");
const { getClassByHeight } = require("./storage");
const { setApi } = require("../../../api");
const { elaraStatemine } = require("../../../testCommon/constants");
const { ApiPromise, WsProvider } = require("@polkadot/api");
jest.setTimeout(testTimeout);

describe("Query class details", () => {
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
    const height = 323750;

    const details = await getClassByHeight(0, height);
    expect(details).toEqual({
      owner: "FhZnLuv3abyNhurW4Bop35YdNQkxK7maB6S1YXeo78jB5oK",
      issuer: "FhZnLuv3abyNhurW4Bop35YdNQkxK7maB6S1YXeo78jB5oK",
      admin: "FhZnLuv3abyNhurW4Bop35YdNQkxK7maB6S1YXeo78jB5oK",
      freezer: "FhZnLuv3abyNhurW4Bop35YdNQkxK7maB6S1YXeo78jB5oK",
      totalDeposit: 0,
      freeHolding: true,
      instances: 0,
      instanceMetadatas: 0,
      attributes: 0,
      isFrozen: false,
    });
  });
});
