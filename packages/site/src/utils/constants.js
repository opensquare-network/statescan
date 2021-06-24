export const nodes = [
  {
    name: "Westmint",
    sub: "Westend",
    icon: "/imgs/icons/rococo.png",
    value: "westmint",
    symbol: "WND",
  },
];

export const blocksLatestHead = [
  { name: "Height" },
  { name: "Time" },
  { name: "Extrinsics", align: "right" },
  { name: "Events", align: "right" },
];

export const transfersLatestHead = [
  { name: "Extrinsic ID" },
  { name: "From" },
  { name: "To" },
  { name: "Quantity", align: "right" },
];

export const assetsHead = [
  { name: "Asset ID" },
  { name: "Symbol" },
  { name: "Name" },
  { name: "Owner" },
  { name: "Issuer" },
  { name: "Holders" },
  { name: "Tody Supply", align: "right" },
];

export const addressExtrincsHead = [
  { name: "Extrinsics ID" },
  { name: "Blocks" },
  { name: "Extrinsics Hash" },
  { name: "Time" },
  { name: "Result" },
  { name: "Action" },
];

export const addressAssetsHead = [
  { name: "Asset ID" },
  { name: "Symbol" },
  { name: "Name" },
  { name: "Balance" },
  { name: "Approved" },
  { name: "Frozen" },
  { name: "Transfer Count" },
];

export const extrinsicEventsHead = [
  { name: "Event ID" },
  { name: "Hash" },
  { name: "Action" },
];

export const blockExtrinsicsHead = [
  { name: "Extrinsic ID" },
  { name: "Hash" },
  { name: "Result" },
  { name: "Action" },
];

export const blockEventsHead = [
  { name: "Event ID" },
  { name: "Hash" },
  { name: "Action" },
];

export const assetTransfersHead = [
  { name: "Event ID" },
  { name: "Hash" },
  { name: "Time" },
  { name: "From" },
  { name: "To" },
  { name: "Quantity" },
];

export const assetHoldersHead = [
  { name: "#" },
  { name: "Address" },
  { name: "Last Tx Time (+UTC)" },
  { name: "Balance" },
];

export const addressHead = [
  "Address",
  "Balance",
  "Reserved",
  "Locked",
  "Account Index",
  "Nonce",
];

export const extrinsicHead = [
  "Timestamp",
  "Block",
  "Extrinsic Hash",
  "Module",
  "Call",
  "From",
  "Result",
  "Parameters",
];

export const extrinsicTransferHead = [
  "Timestamp",
  "Block",
  "Extrinsic Hash",
  "Module",
  "Call",
  "From",
  "To",
  "Value",
  "Result",
  "Parameters",
];

export const blockHead = [
  "Block Time",
  "Status",
  "Hash",
  "Parent Hash",
  "State Root",
  "Extrinsics Root",
  "Validators",
];

export const assetHead = [
  "Symbol",
  "Name",
  "Asset ID",
  "Mint Time",
  "Owner",
  "Issuer",
  "Total Supply",
  "Decimals",
  "Holders",
  "Transfers",
];

export const timeTypes = {
  age: 0,
  date: 1,
};
