const { HttpError } = require("../../exc");
const { extractPage } = require("../../utils");
const {
  getNftClassCollection,
  getClassAttributeCollection,
  getClassTimelineCollection,
  getNftMetadataCollection,
} = require("../../mongo");
const {
  lookupNftMetadata,
  lookupClassDestroyedAt,
} = require("../../common/nft");

async function getNftMetadata(nftObj) {
  if (!nftObj?.dataHash) {
    return undefined;
  }

  const nftMetadataCol = await getNftMetadataCollection();
  const nftMetadata = await nftMetadataCol.findOne({
    dataHash: nftObj.dataHash,
  });

  return nftMetadata;
}

async function queryAllClasses(statusQuery, page, pageSize) {
  const col = await getNftClassCollection();

  const [result] = await col
    .aggregate([
      { $match: statusQuery },
      {
        $facet: {
          items: [
            ...lookupNftMetadata(),
            {
              $sort: {
                "nftMetadata.recognized": -1,
                classId: 1,
              },
            },
            { $skip: page * pageSize },
            { $limit: pageSize },
            ...lookupClassDestroyedAt(),
          ],
          total: [{ $count: "count" }],
        },
      },
    ])
    .toArray();

  return result;
}

async function queryRecognizedClasses(statusQuery, page, pageSize) {
  const col = await getNftClassCollection();

  const [result] = await col
    .aggregate([
      { $match: statusQuery },
      ...lookupNftMetadata(),
      {
        $match: {
          "nftMetadata.recognized": true,
        },
      },
      {
        $facet: {
          items: [
            { $sort: { classId: 1 } },
            { $skip: page * pageSize },
            { $limit: pageSize },
            ...lookupClassDestroyedAt(),
          ],
          total: [{ $count: "count" }],
        },
      },
    ])
    .toArray();

  return result;
}

async function queryUnrecognizedClasses(statusQuery, page, pageSize) {
  const col = await getNftClassCollection();

  const [result] = await col
    .aggregate([
      { $match: statusQuery },
      ...lookupNftMetadata(),
      {
        $match: {
          $or: [
            { "nftMetadata.recognized": false },
            { "nftMetadata.recognized": { $exists: false } },
          ],
        },
      },
      {
        $facet: {
          items: [
            { $sort: { classId: 1 } },
            { $skip: page * pageSize },
            { $limit: pageSize },
            ...lookupClassDestroyedAt(),
          ],
          total: [{ $count: "count" }],
        },
      },
    ])
    .toArray();

  return result;
}

async function getNftClasses(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { recognized, status } = ctx.query;

  // Return active classes by default
  const statusQuery = { isDestroyed: false };
  if (status === "all") {
    delete statusQuery.isDestroyed;
  }
  if (status === "destroyed") {
    statusQuery.isDestroyed = true;
  } else if (status === "frozen") {
    statusQuery["details.isFrozen"] = true;
  }

  if (recognized === "true" || recognized === "1") {
    const result = await queryRecognizedClasses(statusQuery, page, pageSize);

    ctx.body = {
      items: result.items,
      page,
      pageSize,
      total: result.total[0]?.count || 0,
    };
  } else if (recognized === "false" || recognized === "0") {
    const result = await queryUnrecognizedClasses(statusQuery, page, pageSize);

    ctx.body = {
      items: result.items,
      page,
      pageSize,
      total: result.total[0]?.count || 0,
    };
  } else {
    const result = await queryAllClasses(statusQuery, page, pageSize);

    ctx.body = {
      items: result.items,
      page,
      pageSize,
      total: result.total[0]?.count || 0,
    };
  }
}

async function getNftClassById(ctx) {
  const { classId } = ctx.params;
  const col = await getNftClassCollection();
  const option = { sort: { "indexer.blockHeight": -1 } };
  const item = await col.findOne({ classId: parseInt(classId) }, option);

  if (!item) {
    throw new HttpError(400, "Class not found");
  }

  const attrCol = await getClassAttributeCollection();
  const attributes = await attrCol
    .find({
      classId: item.classId,
      classHeight: item.indexer.blockHeight,
    })
    .toArray();

  const nftMetadata = await getNftMetadata(item);

  ctx.body = {
    ...item,
    attributes,
    nftMetadata,
  };
}

async function getNftClassTimelineById(ctx) {
  let { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { classId } = ctx.params;
  const col = await getNftClassCollection();
  const option = { sort: { "indexer.blockHeight": -1 } };
  const item = await col.findOne({ classId: parseInt(classId) }, option);

  if (!item) {
    throw new HttpError(400, "Class not found");
  }

  const q = {
    classId: item.classId,
    classHeight: item.indexer.blockHeight,
  };

  const timelineCol = await getClassTimelineCollection();
  const total = await timelineCol.countDocuments(q);

  if (page === "last") {
    const pageCount = Math.ceil(total / pageSize);
    page = Math.max(pageCount - 1, 0);
  }

  const timeline = await timelineCol
    .find(q)
    .sort({ "indexer.blockHeight": -1, _id: -1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  ctx.body = {
    items: timeline,
    page,
    pageSize,
    total,
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

  const attrCol = await getClassAttributeCollection();
  const attributes = await attrCol
    .find({
      classId: item.classId,
      classHeight: item.indexer.blockHeight,
    })
    .toArray();

  const nftMetadata = await getNftMetadata(item);

  ctx.body = {
    ...item,
    attributes,
    nftMetadata,
  };
}

async function getNftClassTimeline(ctx) {
  let { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { blockHeight, classId } = ctx.params;

  const q = {
    classId: parseInt(classId),
    classHeight: parseInt(blockHeight),
  };

  const timelineCol = await getClassTimelineCollection();
  const total = await timelineCol.countDocuments(q);

  if (page === "last") {
    const pageCount = Math.ceil(total / pageSize);
    page = Math.max(pageCount - 1, 0);
  }

  const timeline = await timelineCol
    .find(q)
    .sort({ "indexer.blockHeight": -1, _id: -1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  ctx.body = {
    items: timeline,
    page,
    pageSize,
    total,
  };
}

module.exports = {
  getNftClasses,
  getNftClassById,
  getNftClassTimelineById,
  getNftClass,
  getNftClassTimeline,
};
