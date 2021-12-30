const {
  getAssetCollection,
  getAddressCollection,
  getBlockCollection,
  getExtrinsicCollection,
  getNftInstanceCollection,
  getNftClassCollection,
  getNftMetadataCollection,
} = require("../../mongo");

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

async function searchAssets({ icasePattern, q, isNum, isAddr, isHash }) {
  if (isAddr || isHash) {
    return null;
  }

  const assetCol = await getAssetCollection();

  if (isNum) {
    return await assetCol.findOne(
      { assetId: Number(q) },
    );
  }

  return await assetCol.findOne(
    {
      $or: [{ name: icasePattern }, { symbol: icasePattern }],
    },
  );
}

async function searchAddresses({ q, isAddr }) {
  if (!isAddr) {
    return null;
  }

  const addressCol = await getAddressCollection();
  return addressCol.findOne({ address: q });
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
  if (!isHash) {
    return null;
  }

  const extrinsicCol = await getExtrinsicCollection();
  return await extrinsicCol.findOne(
    { hash: lowerQuery },
    { projection: { data: 0 } }
  );
}

async function searchNftClassById({ q }) {
  const nftClassCol = await getNftClassCollection();
  const [result] = await nftClassCol
    .aggregate([
      {
        $match: {
          isDestroyed: false,
          classId: Number(q),
        },
      },
      {
        $lookup: {
          from: "nftMetadata",
          localField: "dataHash",
          foreignField: "dataHash",
          as: "nftMetadata",
        },
      },
      {
        $addFields: {
          nftMetadata: {
            $arrayElemAt: ["$nftMetadata", 0],
          },
        },
      },
    ])
    .toArray();

  return result ?? null;
}

async function searchNftClassByText({ icasePattern }) {
  const nftClassCol = await getNftClassCollection();
  return await nftClassCol
    .aggregate([
      {
        $match: {
          dataHash: { $ne: null },
          isDestroyed: false,
        },
      },
      {
        $lookup: {
          from: "nftMetadata",
          localField: "dataHash",
          foreignField: "dataHash",
          as: "nftMetadata",
        },
      },
      {
        $addFields: {
          nftMetadata: {
            $arrayElemAt: ["$nftMetadata", 0],
          },
        },
      },
      {
        $match: {
          "nftMetadata.name": icasePattern,
        },
      },
    ])
    .toArray();
}

async function searchNftClass({ q, icasePattern, isNum, isAddr, isHash }) {
  if (isAddr || isHash) {
    return null;
  }

  if (isNum) {
    return await searchNftClassById({ q });
  }

  return await searchNftClassByText({ icasePattern });
}

async function searchNftInstance({ icasePattern, isNum, isHash, isAddr }) {
  if (isNum || isHash || isAddr) {
    return null;
  }

  const nftInstanceCol = await getNftInstanceCollection();
  const [result] = await nftInstanceCol
    .aggregate([
      {
        $match: {
          dataHash: { $ne: null },
          isDestroyed: false,
        },
      },
      {
        $lookup: {
          from: "nftMetadata",
          localField: "dataHash",
          foreignField: "dataHash",
          as: "nftMetadata",
        },
      },
      {
        $addFields: {
          nftMetadata: {
            $arrayElemAt: ["$nftMetadata", 0],
          },
        },
      },
      {
        $match: {
          "nftMetadata.name": icasePattern,
        },
      },
    ])
    .toArray();

  return result ?? null;
}

async function search(ctx) {
  const { q } = ctx.query;

  if (!q) {
    ctx.body = {
      asset: null,
      address: null,
      block: null,
      extrinsic: null,
      nftClass: null,
      nftInstance: null,
    };
    return;
  }

  const lowerQuery = q.toLowerCase();
  const isHash = !!lowerQuery.match(/^0x[0-9a-f]{64}$/);
  const isNum = q.match(/^[0-9]+$/);
  const isAddr = q.match(/^[0-9a-zA-Z]{47,48}$/);
  const icasePattern = new RegExp(`^${escapeRegex(q)}$`, "i");

  const [asset, address, block, extrinsic, nftClass, nftInstance] =
    await Promise.all([
      searchAssets({ icasePattern, q, isNum, isAddr, isHash }),
      searchAddresses({ q, isAddr }),
      searchBlocks({ q, lowerQuery, isNum, isHash }),
      searchExtriniscs({ isHash, lowerQuery }),
      searchNftClass({ q, icasePattern, isNum }),
      searchNftInstance({ icasePattern, isNum, isAddr, isHash }),
    ]);

  ctx.body = {
    asset,
    address,
    block,
    extrinsic,
    nftClass,
    nftInstance,
  };
}

async function findAssetByPrefix({ icasePrefixPattern }) {
  const assetCol = await getAssetCollection();
  return await assetCol
    .find(
      {
        destroyedAt: null,
        $or: [
          { name: icasePrefixPattern },
          { symbol: icasePrefixPattern },
        ],
      },
    )
    .sort({ name: 1 })
    .limit(10)
    .toArray();
}

async function findAssetById({ prefix }) {
  const assetCol = await getAssetCollection();
  return await assetCol
    .find(
      {
        destroyedAt: null,
        assetId: Number(prefix),
      },
    )
    .toArray();
}

async function findAddressByPrefix({ prefix }) {
  const addressCol = await getAddressCollection();
  return await addressCol
    .find({ address: prefix })
    .sort({ address: 1 })
    .limit(10)
    .toArray();
}

async function findBlockByNumber({ prefix }) {
  const blockCol = await getBlockCollection();
  return await blockCol
    .find(
      { "header.number": Number(prefix) },
      { projection: { extrinsics: 0 } }
    )
    .toArray();
}

async function findBlockByHashPrefix({ prefix }) {
  const blockCol = await getBlockCollection();
  return await blockCol
    .find({ hash: prefix }, { projection: { extrinsics: 0 } })
    .toArray();
}

async function findNftClassesById({ prefix }) {
  const nftClassCol = await getNftClassCollection();
  return await nftClassCol
    .aggregate([
      {
        $match: {
          classId: Number(prefix),
          isDestroyed: false,
        },
      },
      {
        $lookup: {
          from: "nftMetadata",
          localField: "dataHash",
          foreignField: "dataHash",
          as: "nftMetadata",
        },
      },
      {
        $addFields: {
          nftMetadata: {
            $arrayElemAt: ["$nftMetadata", 0],
          },
        },
      },
      { $sort: { "nftMetadata.name": 1 } },
      { $limit: 10 },
    ])
    .toArray();
}

async function findNftClassesByPrefix({ icasePrefixPattern }) {
  const nftMetadataCol = await getNftMetadataCollection();
  const nftMetadatas = await nftMetadataCol
    .aggregate([
      {
        $match: {
          name: icasePrefixPattern,
        },
      },
      { $sort: { name: 1 } },
      {
        $lookup: {
          from: "nftClass",
          let: { dataHash: "$dataHash" },
          pipeline: [
            {
              $match: {
                isDestroyed: false,
                $expr: {
                  $eq: ["$dataHash", "$$dataHash"],
                },
              },
            },
          ],
          as: "nftClass",
        },
      },
      { $unwind: "$nftClass" },
      { $limit: 10 },
    ])
    .toArray();

  return nftMetadatas.map((nftMetadata) => ({
    ...nftMetadata.nftClass,
    nftMetadata: {
      ...nftMetadata,
      nftClass: undefined,
    },
  }));
}

async function findNftInstancesByPrefix({ icasePrefixPattern }) {
  const nftMetadataCol = await getNftMetadataCollection();
  const nftMetadatas = await nftMetadataCol
    .aggregate([
      {
        $match: {
          name: icasePrefixPattern,
        },
      },
      { $sort: { name: 1 } },
      {
        $lookup: {
          from: "nftInstance",
          let: { dataHash: "$dataHash" },
          pipeline: [
            {
              $match: {
                isDestroyed: false,
                $expr: {
                  $eq: ["$dataHash", "$$dataHash"],
                },
              },
            },
            {
              $lookup: {
                from: "nftClass",
                let: { classId: "$classId", classHeight: "$classHeight" },
                pipeline: [
                  {
                    $match: {
                      isDestroyed: false,
                      $expr: {
                        $and: [
                          { $eq: ["$classId", "$$classId"] },
                          { $eq: ["$indexer.blockHeight", "$$classHeight"] },
                        ]
                      }
                    }
                  },
                ],
                as: "nftClass",
              }
            },
            { $unwind: "$nftClass" },
          ],
          as: "nftInstance",
        },
      },
      { $unwind: "$nftInstance" },
      { $limit: 10 },
    ])
    .toArray();

  return nftMetadatas.map((nftMetadata) => ({
    ...nftMetadata.nftInstance,
    nftMetadata: {
      ...nftMetadata,
      nftInstance: undefined,
    },
  }));
}

function autoCompleteAssets({
  prefix,
  icasePrefixPattern,
  isNum,
  isAddr,
  isHash,
}) {
  if (isAddr || isHash) {
    return [];
  }

  if (isNum) {
    return findAssetById({ prefix });
  } else if (prefix.length >= 2) {
    return findAssetByPrefix({ icasePrefixPattern });
  }

  return [];
}

function autoCompleteAddresses({ prefix, isAddr }) {
  if (!isAddr) {
    return [];
  }

  return findAddressByPrefix({ prefix });
}

function autoCompleteBlocks({ prefix, isNum, isHash }) {
  if (isNum) {
    return findBlockByNumber({ prefix });
  } else if (isHash) {
    return findBlockByHashPrefix({ prefix });
  }

  return [];
}

function autoCompleteNftClasses({
  prefix,
  icasePrefixPattern,
  isNum,
  isAddr,
  isHash,
}) {
  if (isAddr || isHash) {
    return [];
  }

  if (isNum) {
    return findNftClassesById({ prefix });
  } else if (prefix.length >= 2) {
    return findNftClassesByPrefix({ prefix, icasePrefixPattern });
  }

  return [];
}

function autoCompleteNftInstances({
  prefix,
  icasePrefixPattern,
  isNum,
  isAddr,
  isHash,
}) {
  if (isNum || isAddr || isHash) {
    return [];
  }

  if (prefix.length < 2) {
    return [];
  }

  return findNftInstancesByPrefix({ icasePrefixPattern });
}

async function searchAutoComplete(ctx) {
  const { prefix } = ctx.query;

  if (!prefix) {
    ctx.body = {
      assets: [],
      addresses: [],
      blocks: [],
      nftClasses: [],
      nftInstances: [],
    };
    return;
  }

  const lowerPrefix = prefix.toLowerCase();
  const isHash = !!lowerPrefix.match(/^0x[0-9a-f]{64}$/);
  const isAddr = prefix.match(/^[0-9a-zA-Z]{47,48}$/);
  const isNum = prefix.match(/^[0-9]+$/);

  const icasePrefixPattern = new RegExp(`${escapeRegex(lowerPrefix)}`, "i");

  const [assets, addresses, blocks, nftClasses, nftInstances] =
    await Promise.all([
      autoCompleteAssets({ prefix, icasePrefixPattern, isNum, isAddr, isHash }),
      autoCompleteAddresses({ prefix, isAddr }),
      autoCompleteBlocks({ prefix: lowerPrefix, isNum, isHash }),
      autoCompleteNftClasses({
        prefix,
        icasePrefixPattern,
        isNum,
        isAddr,
        isHash,
      }),
      autoCompleteNftInstances({
        prefix,
        icasePrefixPattern,
        isNum,
        isAddr,
        isHash,
      }),
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
