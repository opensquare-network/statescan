const {
  testConsts: { testTimeout },
} = require("@statescan/common");
const { getClassByHeight } = require("./storage");
const {
  test: { setupApi, disconnect },
} = require("@statescan/common");
jest.setTimeout(testTimeout);

describe("Query class details", () => {
  beforeAll(async () => {
    await setupApi();
  });

  afterAll(async () => {
    await disconnect();
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
