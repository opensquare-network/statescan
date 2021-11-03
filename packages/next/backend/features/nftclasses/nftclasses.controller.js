const { HttpError } = require("../../exc");
const { extractPage } = require("../../utils");
const {
  getNftClassCollection,
  getClassAttributeCollection,
  getClassTimelineCollection,
  getIpfsMetadataCollection,
}  = require("../../mongo");

async function getIpfsData(nftObj) {
  if (!nftObj?.metadata?.data) {
    return undefined;
  }

  const ipfsMetadataCol = await getIpfsMetadataCollection();
  const ipfsMetadata = await ipfsMetadataCol.findOne({
    dataId: nftObj.metadata.data,
  });

  return ipfsMetadata;
}

async function getNftClasses(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const col = await getNftClassCollection();

  const q = { isDestroyed: false };

  const items = await col.aggregate([
    { $match: q },
    {
      $sort: {
        classId: 1,
      }
    },
    { $skip: page * pageSize },
    { $limit: pageSize },
    {
      $lookup: {
        from: "ipfsMetadata",
        localField: "metadata.data",
        foreignField: "dataId",
        as: "ipfsMetadata",
      }
    },
    {
      $addFields: {
        ipfsMetadata: {
          $arrayElemAt: ["$ipfsMetadata", 0]
        }
      }
    }
  ]).toArray();

  const total = await col.countDocuments(q);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };

}

async function getNftClassById(ctx) {
  const { classId } = ctx.params;
  const col = await getNftClassCollection();
  const option = { sort: { "createdAt.blockHeight": -1 } };
  const item = await col.findOne({ classId: parseInt(classId) }, option);

  if (!item) {
    throw new HttpError(400, "Class not found");
  }

  const timelineCol = await getClassTimelineCollection();
  const timeline = await timelineCol.find({
    classId: item.classId,
    classHeight: item.indexer.blockHeight,
  }).toArray();

  const attrCol = await getClassAttributeCollection();
  const attributes = await attrCol.find({
    classId: item.classId,
    classHeight: item.indexer.blockHeight,
  }).toArray();

  const ipfsMetadata = await getIpfsData(item);

  ctx.body = {
    ...item,
    timeline,
    attributes,
    ipfsMetadata,
  };
}

async function getNftClass(ctx) {
  const { blockHeight, classId } = ctx.params;
  const col = await getNftClassCollection();
  const item = await col.findOne({
    classId: parseInt(classId),
    "indexer.blockHeight": parseInt(blockHeight),
  });

  if (!item) {
    throw new HttpError(400, "Class not found");
  }

  const timelineCol = await getClassTimelineCollection();
  const timeline = await timelineCol.find({
    classId: item.classId,
    classHeight: item.indexer.blockHeight,
  }).toArray();

  const attrCol = await getClassAttributeCollection();
  const attributes = await attrCol.find({
    classId: item.classId,
    classHeight: item.indexer.blockHeight,
  }).toArray();

  const ipfsMetadata = await getIpfsData(item);

  ctx.body = {
    ...item,
    timeline,
    attributes,
    ipfsMetadata,
  };
}

module.exports = {
  getNftClasses,
  getNftClassById,
  getNftClass,
};
