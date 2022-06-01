const { extractCid } = require("../extractCid");
const { stringToHex } = require("@polkadot/util");

const cid = "QmY3Csu8rsEbSL7A1pjdnq3ejEHYzuabkgopfrRqggez5x";
const ipfsUrl = `ipfs://ipfs/${cid}`;

describe("Extract", () => {
  test("cid with prefix works", () => {
    const extracted = extractCid(stringToHex(ipfsUrl));
    expect(extracted).toEqual(cid);

    const strExtracted = extractCid(ipfsUrl);
    expect(strExtracted).toEqual(cid);
  });

  test("cid works", () => {
    const extracted = extractCid(stringToHex(cid));
    expect(extracted).toEqual(cid);

    const strExtracted = extractCid(cid);
    expect(strExtracted).toEqual(cid);
  });
});
