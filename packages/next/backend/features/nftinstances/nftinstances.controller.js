const { HttpError } = require("../../exc");
const { extractPage } = require("../../utils");
const {
  getNftClassCollection,
  getNftInstanceCollection,
  getInstanceAttributeCollection,
  getInstanceTimelineCollection,
  getNftMetadataCollection,
}  = require("../../mongo");

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

async function getNftInstancesByClassId(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { classId } = ctx.params;

  const classCol = await getNftClassCollection();
  const nftClass = await classCol.findOne(
    { classId: parseInt(classId) },
    { sort: { "indexer.blockHeight": -1 } }
  );
  if (!nftClass) {
    throw new HttpError(404, "NFT class not found");
  }

  const q = {
    classId: nftClass.classId,
    classHeight: nftClass.indexer.blockHeight,
    isDestroyed: false,
  };

  const instanceCol = await getNftInstanceCollection();
  const items = await instanceCol.aggregate([
    { $match: q },
    {
      $sort: {
        instanceId: 1,
      },
    },
    { $skip: page * pageSize },
    { $limit: pageSize },
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
          $arrayElemAt: ["$nftMetadata", 0],
        },
      }
    }
  ]).toArray();

  const total = await instanceCol.countDocuments(q);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getNftInstancesByClass(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { classId, classHeight } = ctx.params;

  const classCol = await getNftClassCollection();
  const nftClass = await classCol.findOne(
    {
      classId: parseInt(classId),
      "indexer.blockHeight": parseInt(classHeight),
    },
  );
  if (!nftClass) {
    throw new HttpError(404, "NFT class not found");
  }

  const q = {
    classId: nftClass.classId,
    classHeight: nftClass.indexer.blockHeight,
    isDestroyed: false,
  };
  const instanceCol = await getNftInstanceCollection();
  const items = await instanceCol.aggregate([
    { $match: q },
    {
      $sort: {
        instanceId: 1,
      },
    },
    { $skip: page * pageSize },
    { $limit: pageSize },
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
          $arrayElemAt: ["$nftMetadata", 0],
        },
      }
    }
  ]).toArray();
  const total = await instanceCol.countDocuments(q);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getNftInstanceById(ctx) {
  const { classId, instanceId } = ctx.params;

  const classCol = await getNftClassCollection();
  const nftClass = await classCol.findOne(
    { classId: parseInt(classId) },
    { sort: { "indexer.blockHeight": -1 } }
  );
  if (!nftClass) {
    throw new HttpError(404, "NFT class not found");
  }

  const instanceCol = await getNftInstanceCollection();
  const nftInstance = await instanceCol.findOne(
    {
      classId: nftClass.classId,
      classHeight: nftClass.indexer.blockHeight,
      instanceId: parseInt(instanceId),
    },
    { sort: { "indexer.blockHeight": -1 } }
  );
  if (!nftInstance) {
    throw new HttpError(404, "NFT instance not found");
  }

  const timelineCol = await getInstanceTimelineCollection();
  const timeline = await timelineCol.find({
    classId: nftInstance.classId,
    classHeight: nftInstance.classHeight,
    instanceId: nftInstance.instanceId,
    instanceHeight: nftInstance.indexer.blockHeight,
  }, { sort: { "indexer.blockTime": -1 } }).toArray();

  const attrCol = await getInstanceAttributeCollection();
  const attributes = await attrCol.find({
    classId: nftInstance.classId,
    classHeight: nftInstance.classHeight,
    instanceId: nftInstance.instanceId,
    instanceHeight: nftInstance.indexer.blockHeight,
  }).toArray();

  const nftMetadata = await getNftMetadata(nftInstance);

  ctx.body = {
    ...nftInstance,
    timeline,
    attributes,
    nftMetadata,
  };
}

async function getNftInstance(ctx) {
  const { classId, classHeight, instanceId, instanceHeight } = ctx.params;

  const classCol = await getNftClassCollection();
  const nftClass = await classCol.findOne(
    {
      classId: parseInt(classId),
      "indexer.blockHeight": parseInt(classHeight),
    },
  );
  if (!nftClass) {
    throw new HttpError(404, "NFT class not found");
  }

  const instanceCol = await getNftInstanceCollection();
  const nftInstance = await instanceCol.findOne(
    {
      classId: nftClass.classId,
      classHeight: nftClass.indexer.blockHeight,
      instanceId: parseInt(instanceId),
      "indexer.blockHeight": parseInt(instanceHeight),
    },
  );
  if (!nftInstance) {
    throw new HttpError(404, "NFT instance not found");
  }

  const timelineCol = await getInstanceTimelineCollection();
  const timeline = await timelineCol.find({
    classId: nftInstance.classId,
    classHeight: nftInstance.classHeight,
    instanceId: nftInstance.instanceId,
    instanceHeight: nftInstance.indexer.blockHeight,
  }, { sort: { "indexer.blockTime": -1 } }).toArray();

  const attrCol = await getInstanceAttributeCollection();
  const attributes = await attrCol.find({
    classId: nftInstance.classId,
    classHeight: nftInstance.classHeight,
    instanceId: nftInstance.instanceId,
    instanceHeight: nftInstance.indexer.blockHeight,
  }).toArray();

  const nftMetadata = await getNftMetadata(nftInstance);

  ctx.body = {
    ...nftInstance,
    timeline,
    attributes,
    nftMetadata,
  };
}

module.exports = {
  getNftInstancesByClassId,
  getNftInstancesByClass,
  getNftInstanceById,
  getNftInstance,
};
