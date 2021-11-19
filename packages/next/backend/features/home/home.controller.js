const { HttpError } = require("../../exc");
const {
  getAssetCollection,
  getAddressCollection,
  getBlockCollection,
  getExtrinsicCollection,
  getNftInstanceCollection,
  getNftClassCollection,
} = require("../../mongo");

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

async function searchAssets({ icaseQuery, q, isNum }) {
  const assetCol = await getAssetCollection();
  return await assetCol.findOne(
    {
      $or: [
        { name: icaseQuery },
        { symbol: icaseQuery },
        ...(isNum ? [{ assetId: Number(q) }] : []),
      ],
    },
    { projection: { timeline: 0 } }
  );
}

async function searchAddresses({ icaseQuery, isAddr }) {
  if (isAddr) {
    const addressCol = await getAddressCollection();
    return addressCol.findOne({ address: icaseQuery });
  }
  return null;
}

async function searchBlocks({ isNum, isHash, q, lowerQuery }) {
  const blockCol = await getBlockCollection();
  if (isNum) {
    return await blockCol.findOne(
      { "header.number": Number(q) },
      { projection: { extrinsics: 0 } }
    );
  } else if (isHash) {
    return await blockCol.findOne(
      { hash: lowerQuery },
      { projection: { extrinsics: 0 } }
    );
  }
  return null;
}

async function searchExtriniscs({ isHash, lowerQuery }) {
  if (isHash) {
    const extrinsicCol = await getExtrinsicCollection();
    return await extrinsicCol.findOne(
      { hash: lowerQuery },
      { projection: { data: 0 } }
    );
  }
  return null;
}

async function searchNftClass({ q, icaseQuery, isNum }) {
  const nftClassCol = await getNftClassCollection();
  return await nftClassCol.aggregate([
    {
      $lookup: {
        from: "nftMetadata",
        localField: "dataHash",
        foreignField: "dataHash",
        as: "nftMetadata",
      }
    },
    {
      $addFields: {
        nftMetadata: {
          $arrayElemAt: [
            "$nftMetadata",
            0,
          ],
        }
      }
    },
    {
      $match: {
        isDestroyed: false,
        $or: [
          { "nftMetadata.name": icaseQuery },
          ...(isNum ? [{ classId: Number(q) }] : []),
        ]
      }
    },
    { $project: { timeline: 0 } }
  ]).toArray()[0];
}

async function searchNftInstance({ icaseQuery }) {
  const nftInstanceCol = await getNftInstanceCollection();
  return await nftInstanceCol.aggregate([
    {
      $lookup: {
        from: "nftMetadata",
        localField: "dataHash",
        foreignField: "dataHash",
        as: "nftMetadata",
      }
    },
    {
      $addFields: {
        nftMetadata: {
          $arrayElemAt: [
            "$nftMetadata",
            0,
          ],
        }
      }
    },
    {
      $match: {
        isDestroyed: false,
        $or: [
          { "nftMetadata.name": icaseQuery },
        ]
      }
    },
    { $project: { timeline: 0 } }
  ]).toArray()[0];
}

async function search(ctx) {
  const { q } = ctx.query;

  if (!q) {
    ctx.body = {
      asset: null,
      address: null,
      block: null,
      extrinsic: null,
    };
    return;
  }

  const lowerQuery = q.toLowerCase();
  const isHash = !!lowerQuery.match(/^0x[0-9a-f]{64}$/);
  const isNum = q.match(/^[0-9]+$/);
  const isAddr = q.match(/^[0-9a-zA-Z]{47,48}$/);
  const icaseQuery = new RegExp(`^${escapeRegex(q)}$`, "i");

  const [asset, address, block, extrinsic] = await Promise.all([
    searchAssets({ icaseQuery, q, isNum }),
    searchAddresses({ icaseQuery, isAddr }),
    searchBlocks({ isNum, isHash, q, lowerQuery }),
    searchExtriniscs({ isHash, lowerQuery }),
    searchNftClass({ q, icaseQuery, isNum }),
    searchNftInstance({ icaseQuery }),
  ]);

  ctx.body = {
    asset,
    address,
    block,
    extrinsic,
  };
}

async function findAssetByPrefix({ prefix, prefixPattern, isNum }) {
  const assetCol = await getAssetCollection();
  return await assetCol.find(
    {
      $or: [
        { name: prefixPattern },
        { symbol: prefixPattern },
        ...(isNum ? [{ assetId: Number(prefix) }] : []),
      ],
    },
    { projection: { timeline: 0 } }
  )
  .sort({ name: 1 })
  .limit(10)
  .toArray();
}

async function findAssetById({ prefix }) {
  const assetCol = await getAssetCollection();
  return await assetCol.find(
    { assetId: Number(prefix) },
    { projection: { timeline: 0 } }
  ).toArray();
}

async function findAddressByPrefix({ prefixPattern }) {
  const addressCol = await getAddressCollection();
  return await addressCol
    .find({ address: prefixPattern })
    .sort({ address: 1 })
    .limit(10)
    .toArray();
}

async function findBlockByNumber({ prefix }) {
  const blockCol = await getBlockCollection();
  return await blockCol.find(
    { "header.number": Number(prefix) },
    { projection: { extrinsics: 0 } }
  ).toArray();
}

async function findBlockByHashPrefix({ prefixPattern }) {
  const blockCol = await getBlockCollection();
  return await blockCol.find(
    { hash: prefixPattern },
    { projection: { extrinsics: 0 } }
  ).toArray();
}

async function findNftClassesById({ prefix }) {
  const nftClassCol = await getNftClassCollection();
  return await nftClassCol.aggregate([
    {
      $match: {
        classId: Number(prefix),
        isDestroyed: false
      },
    },
    {
      $lookup: {
        from: "nftMetadata",
        localField: "dataHash",
        foreignField: "dataHash",
        as: "nftMetadata",
      }
    },
    {
      $addFields: {
        nftMetadata: {
          $arrayElemAt: [
            "$nftMetadata",
            0,
          ],
        }
      }
    },
    { $project: { timeline: 0 } },
    { $sort: { "nftMetadata.name": 1 } },
    { $limit: 10 },
  ]).toArray();
}

async function findNftClassesByPrefix({ prefix, prefixPattern, isNum }) {
  const nftClassCol = await getNftClassCollection();
  return await nftClassCol.aggregate([
    {
      $lookup: {
        from: "nftMetadata",
        localField: "dataHash",
        foreignField: "dataHash",
        as: "nftMetadata",
      }
    },
    {
      $addFields: {
        nftMetadata: {
          $arrayElemAt: [
            "$nftMetadata",
            0,
          ],
        }
      }
    },
    {
      $match: {
        isDestroyed: false,
        $or: [
          { "nftMetadata.name": prefixPattern },
          ...(isNum ? [{ classId: Number(prefix) }] : []),
        ],
      }
    },
    { $project: { timeline: 0 } },
    { $sort: { "nftMetadata.name": 1 } },
    { $limit: 10 },
  ]).toArray();
}

async function findNftInstancesByPrefix({ prefixPattern }) {
  const nftInstanceCol = await getNftInstanceCollection();
  return await nftInstanceCol.aggregate([
    {
      $lookup: {
        from: "nftMetadata",
        localField: "dataHash",
        foreignField: "dataHash",
        as: "nftMetadata",
      }
    },
    {
      $addFields: {
        nftMetadata: {
          $arrayElemAt: [
            "$nftMetadata",
            0,
          ],
        }
      }
    },
    {
      $match: {
        isDestroyed: false,
        $or: [
          { "nftMetadata.name": prefixPattern },
        ],
      }
    },
    { $project: { timeline: 0 } },
    { $sort: { "nftMetadata.name": 1 } },
    { $limit: 10 },
  ]).toArray();
}

function autoCompleteAssets({ prefix, prefixPattern, isNum }) {
  if (prefix.length >= 2) {
    return findAssetByPrefix({ prefix, prefixPattern, isNum });
  } else if (isNum) {
    return findAssetById({ prefix });
  }

  return [];
}

function autoCompleteAddresses({ prefix, prefixPattern }) {
  if (prefix.length >= 4) {
    return findAddressByPrefix({ prefixPattern });
  }
  return [];
}

function autoCompleteBlocks({ prefix, prefixPattern, isNum, isHash }) {
  if (isNum) {
    return findBlockByNumber({ prefix });
  } else if (isHash) {
    return findBlockByHashPrefix({ prefixPattern });
  }

  return [];
}

function autoCompleteNftClasses({ prefix, prefixPattern, isNum }) {
  if (prefix.length >= 2) {
    return findNftClassesByPrefix({ prefix, prefixPattern, isNum });
  } else if (isNum) {
    return findNftClassesById({ prefix });
  }
  return [];
}

function autoCompleteNftInstances({ prefix, prefixPattern }) {
  if (prefix.length >= 2) {
    return findNftInstancesByPrefix({ prefixPattern });
  }
  return [];
}

async function searchAutoComplete(ctx) {
  const { prefix } = ctx.query;

  if (!prefix) {
    ctx.body = {
      assets: [],
      addresses: [],
      blocks: [],
    };
    return;
  }

  const lowerPrefix = prefix.toLowerCase();
  const isHash = !!lowerPrefix.match(/^0x[0-9a-f]{6,64}$/);
  const isNum = prefix.match(/^[0-9]+$/);

  const prefixPattern = new RegExp(`^${escapeRegex(lowerPrefix)}`, "i");

  const [assets, addresses, blocks, nftClasses, nftInstances] = await Promise.all([
    autoCompleteAssets({ prefix, prefixPattern, isNum }),
    autoCompleteAddresses({ prefix, prefixPattern }),
    autoCompleteBlocks({ prefix, prefixPattern, isNum, isHash }),
    autoCompleteNftClasses({ prefix, prefixPattern, isNum }),
    autoCompleteNftInstances({ prefix, prefixPattern }),
  ]);

  ctx.body = {
    assets,
    addresses,
    blocks,
    nftClasses,
    nftInstances,
  };
}

module.exports = {
  search,
  searchAutoComplete,
};
