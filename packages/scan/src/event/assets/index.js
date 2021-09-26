const { hexToString } = require("@polkadot/util");
const {
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
  getAssetApprovalCollection,
} = require("../../mongo");
const { getApi } = require("../../api");
const asyncLocalStorage = require("../../asynclocalstorage");
const { Modules, AssetsEvents } = require("../../utils/constants");
const { addAddresses } = require("../../store/blockAddresses");
const { addAddress } = require("../../store/blockAddresses");
const { toDecimal128 } = require("../../utils");

async function saveNewAssetTransfer(
  blockIndexer,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  assetId,
  from,
  to,
  balance
) {
  const session = asyncLocalStorage.getStore();
  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne(
    { assetId, destroyedAt: null },
    { session }
  );
  if (!asset) {
    return;
  }

  const col = await getAssetTransferCollection();
  const result = await col.insertOne(
    {
      indexer: blockIndexer,
      eventSort,
      extrinsicIndex,
      extrinsicHash,
      asset: asset._id,
      from,
      to,
      balance,
    },
    { session }
  );
}

async function updateOrCreateAsset(blockIndexer, assetId) {
  const api = await getApi();
  const asset = (
    await api.query.assets.asset.at(blockIndexer.blockHash, assetId)
  ).toJSON();
  const metadata = (
    await api.query.assets.metadata.at(blockIndexer.blockHash, assetId)
  ).toJSON();

  const session = asyncLocalStorage.getStore();
  const col = await getAssetCollection();
  const result = await col.updateOne(
    { assetId, destroyedAt: null },
    {
      $setOnInsert: {
        createdAt: blockIndexer,
      },
      $set: {
        ...asset,
        ...metadata,
        symbol: hexToString(metadata.symbol),
        name: hexToString(metadata.name),
      },
    },
    { upsert: true, session }
  );
}

async function saveAssetTimeline(
  blockIndexer,
  assetId,
  section,
  method,
  eventData,
  eventSort,
  extrinsicIndex,
  extrinsicHash
) {
  const api = await getApi();
  const asset = (
    await api.query.assets.asset.at(blockIndexer.blockHash, assetId)
  ).toJSON();
  const metadata = (
    await api.query.assets.metadata.at(blockIndexer.blockHash, assetId)
  ).toJSON();

  const session = asyncLocalStorage.getStore();
  const col = await getAssetCollection();
  const result = await col.updateOne(
    { assetId, destroyedAt: null },
    {
      $push: {
        timeline: {
          type: "event",
          section,
          method,
          eventData,
          eventIndexer: blockIndexer,
          eventSort,
          extrinsicIndex,
          extrinsicHash,
          asset: {
            ...asset,
            ...metadata,
            symbol: hexToString(metadata.symbol),
            name: hexToString(metadata.name),
          },
        },
      },
    },
    { session }
  );
}

async function destroyAsset(blockIndexer, assetId) {
  const session = asyncLocalStorage.getStore();
  const col = await getAssetCollection();
  const result = await col.updateOne(
    { assetId },
    {
      $set: {
        destroyedAt: blockIndexer,
      },
    },
    { session }
  );
}

async function updateOrCreateAssetHolder(blockIndexer, assetId, address) {
  const api = await getApi();
  const account = (
    await api.query.assets.account.at(blockIndexer.blockHash, assetId, address)
  ).toJSON();

  const session = asyncLocalStorage.getStore();
  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne(
    { assetId, destroyedAt: null },
    { session }
  );
  if (!asset) {
    return;
  }

  const col = await getAssetHolderCollection();
  const result = await col.updateOne(
    {
      asset: asset._id,
      address,
    },
    {
      $set: {
        ...account,
        balance: toDecimal128(account.balance),
        dead: account.balance === 0 ? true : false,
        lastUpdatedAt: blockIndexer,
      },
    },
    { upsert: true, session }
  );
}

async function updateOrCreateApproval(blockIndexer, assetId, owner, delegate) {
  const api = await getApi();
  const approval = (
    await api.query.assets.approvals.at(
      blockIndexer.blockHash,
      assetId,
      owner,
      delegate
    )
  ).toJSON();

  const session = asyncLocalStorage.getStore();
  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne(
    { assetId, destroyedAt: null },
    { session }
  );
  if (!asset) {
    return;
  }

  const col = await getAssetApprovalCollection();
  const result = await col.updateOne(
    {
      asset: asset._id,
      owner,
      delegate,
    },
    {
      $set: {
        ...approval,
        lastUpdatedAt: blockIndexer,
      },
    },
    { upsert: true, session }
  );
}

function isAssetsEvent(section) {
  return section === Modules.Assets;
}

async function handleAssetsEvent(
  event,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  blockIndexer
) {
  const { section, method, data } = event;

  if (!isAssetsEvent(section)) {
    return false;
  }

  const eventData = data.toJSON();

  // Save assets
  if (
    [
      AssetsEvents.Created,
      AssetsEvents.ForceCreated,
      AssetsEvents.MetadataSet,
      AssetsEvents.Issued,
      AssetsEvents.Burned,
      AssetsEvents.AssetStatusChanged,
      AssetsEvents.TeamChanged,
      AssetsEvents.OwnerChanged,
      AssetsEvents.AssetFrozen,
      AssetsEvents.AssetThawed,
    ].includes(method)
  ) {
    const [assetId] = eventData;
    await updateOrCreateAsset(blockIndexer, assetId);
    await saveAssetTimeline(
      blockIndexer,
      assetId,
      section,
      method,
      eventData,
      eventSort,
      extrinsicIndex,
      extrinsicHash
    );
  }

  if (method === AssetsEvents.Destroyed) {
    const [assetId] = eventData;
    await saveAssetTimeline(
      blockIndexer,
      assetId,
      section,
      method,
      eventData,
      eventSort,
      extrinsicIndex,
      extrinsicHash
    );
    await destroyAsset(blockIndexer, assetId);
  }

  if (method === AssetsEvents.Transferred) {
    const [assetId] = eventData;
    await updateOrCreateAsset(blockIndexer, assetId);
  }

  // Save transfers
  if (method === AssetsEvents.Transferred) {
    const [assetId, from, to, balance] = eventData;
    await saveNewAssetTransfer(
      blockIndexer,
      eventSort,
      extrinsicIndex,
      extrinsicHash,
      assetId,
      from,
      to,
      balance
    );
  }

  // Save asset holders
  if (
    [
      AssetsEvents.Issued,
      AssetsEvents.Burned,
      AssetsEvents.Frozen,
      AssetsEvents.Thawed,
    ].includes(method)
  ) {
    const [assetId, accountId] = eventData;
    addAddress(blockIndexer.blockHeight, accountId);
    await updateOrCreateAssetHolder(blockIndexer, assetId, accountId);
  }

  if (method === AssetsEvents.Transferred) {
    const [assetId, from, to] = eventData;
    addAddresses(blockIndexer.blockHeight, [from, to]);
    await updateOrCreateAssetHolder(blockIndexer, assetId, from);
    await updateOrCreateAssetHolder(blockIndexer, assetId, to);
  }

  if (
    [
      AssetsEvents.ApprovedTransfer,
      AssetsEvents.ApprovalCancelled,
      AssetsEvents.TransferredApproved,
    ].includes(method)
  ) {
    const [assetId, owner, delegate] = eventData;
    await updateOrCreateApproval(blockIndexer, assetId, owner, delegate);
  }

  return true;
}

module.exports = {
  handleAssetsEvent,
};
