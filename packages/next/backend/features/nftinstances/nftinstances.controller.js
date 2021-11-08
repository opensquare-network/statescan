const { HttpError } = require("../../exc");
const { extractPage } = require("../../utils");
const {
  getNftClassCollection,
  getNftInstanceCollection,
  getInstanceAttributeCollection,
  getInstanceTimelineCollection,
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
        from: "ipfsMetadata",
        localField: "metadata.data",
        foreignField: "dataId",
        as: "ipfsMetadata",
      }
    },
    {
      $addFields: {
        ipfsMetadata: {
          $arrayElemAt: ["$ipfsMetadata", 0],
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
        from: "ipfsMetadata",
        localField: "metadata.data",
        foreignField: "dataId",
        as: "ipfsMetadata",
      }
    },
    {
      $addFields: {
        ipfsMetadata: {
          $arrayElemAt: ["$ipfsMetadata", 0],
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
    instanceHeight: nftInstance.instanceHeight,
  }).toArray();

  const attrCol = await getInstanceAttributeCollection();
  const attributes = await attrCol.find({
    classId: nftInstance.classId,
    classHeight: nftInstance.classHeight,
    instanceId: nftInstance.instanceId,
    instanceHeight: nftInstance.instanceHeight,
  }).toArray();

  const ipfsMetadata = await getIpfsData(nftInstance);

  ctx.body = {
    ...nftInstance,
    timeline,
    attributes,
    ipfsMetadata,
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
    instanceHeight: nftInstance.instanceHeight,
  }).toArray();

  const attrCol = await getInstanceAttributeCollection();
  const attributes = await attrCol.find({
    classId: nftInstance.classId,
    classHeight: nftInstance.classHeight,
    instanceId: nftInstance.instanceId,
    instanceHeight: nftInstance.instanceHeight,
  }).toArray();

  const ipfsMetadata = await getIpfsData(nftInstance);

  ctx.body = {
    ...nftInstance,
    timeline,
    attributes,
    ipfsMetadata,
  };
}

module.exports = {
  getNftInstancesByClassId,
  getNftInstancesByClass,
  getNftInstanceById,
  getNftInstance,
};
