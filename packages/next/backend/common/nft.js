function lookupNftMetadata() {
  return [
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
          $arrayElemAt: ["$nftMetadata", 0]
        }
      }
    },
  ];
}

function lookupClassDestroyedAt() {
  return [
    {
      $lookup: {
        from: "classTimeline",
        let: { classId: "$classId", classHeight: "$indexer.blockHeight" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$classId", "$$classId"] },
                  { $eq: ["$classHeight", "$$classHeight"] },
                  { $eq: ["$name", "Destroyed"] },
                ]
              }
            }
          },
        ],
        as: "destroyedAt",
      }
    },
    {
      $addFields: {
        destroyedAt: {
          $arrayElemAt: ["$destroyedAt", 0]
        }
      }
    },
    {
      $addFields: {
        destroyedAt: "$destroyedAt.indexer"
      }
    },
  ];
}

function lookupNftClass(extraCondition = {}) {
  return [
    {
      $lookup: {
        from: "nftClass",
        let: { classId: "$classId", classHeight: "$classHeight" },
        pipeline: [
          {
            $match: {
              ...extraCondition,
              $expr: {
                $and: [
                  { $eq: ["$classId", "$$classId"] },
                  { $eq: ["$indexer.blockHeight", "$$classHeight"] },
                ],
              },
            },
          },
          ...lookupNftMetadata(),
        ],
        as: "nftClass",
      },
    },
    {
      $addFields: {
        nftClass: { $arrayElemAt: ["$nftClass", 0] },
      },
    }
  ];
}

function lookupNftInstance(extraCondition = {}) {
  return [
    {
      $lookup: {
        from: "nftInstance",
        let: {
          classId: "$classId",
          classHeight: "$classHeight",
          instanceId: "$instanceId",
          instanceHeight: "$instanceHeight",
        },
        pipeline: [
          {
            $match: {
              ...extraCondition,
              $expr: {
                $and: [
                  { $eq: ["$classId", "$$classId"] },
                  { $eq: ["$classHeight", "$$classHeight"] },
                  { $eq: ["$instanceId", "$$instanceId"] },
                  { $eq: ["$indexer.blockHeight", "$$instanceHeight"] },
                ],
              },
            },
          },
          ...lookupNftMetadata(),
          ...lookupNftClass(),
        ],
        as: "nftInstance",
      },
    },
    {
      $addFields: {
        nftInstance: { $arrayElemAt: ["$nftInstance", 0] },
      },
    }
  ];
}

module.exports = {
  lookupNftMetadata,
  lookupClassDestroyedAt,
  lookupNftClass,
  lookupNftInstance,
};
