// asset id => asset info
const statemineInfo = new Map([
  [
    8, //asset id
    {
      icon: "/imgs/icons/asset/rmrk.svg",
      about:
        "RMRK.app is a part of Kusama's broader NFT strategy and a way to abuse Kusama's system.remark extrinsic to write custom notes onto the chain in a standardized and structured way. $RMRK is the governance, staking, and collateral token.",
      links: [
        {
          name: "Website",
          url: "https://rmrk.app",
          icon: "/imgs/icons/link-default.svg",
        },
        {
          name: "Twitter: @rmrkapp",
          url: "https://twitter.com/RmrkApp",
          icon: "/imgs/icons/link-twitter.svg",
        },
        {
          name: "Twitter: @rmrkstatus",
          url: "https://twitter.com/rmrkstatus",
          icon: "/imgs/icons/link-twitter.svg",
        },
        {
          name: "Telegram: Kanaria project",
          url: "https://t.me/kanaria_official",
          icon: "/imgs/icons/link-telegram.svg",
        },
        {
          name: "Telegram: RMRK in general",
          url: "https://t.me/rmrkapp",
          icon: "/imgs/icons/link-telegram.svg",
        },
        {
          name: "Subsocial",
          url: "https://app.subsocial.network/@rmrkapp",
          icon: "/imgs/icons/link-subsocial.svg",
        },
        {
          name: "Youtube",
          url: "https://www.youtube.com/channel/UCZ9dCwNm2aErxsYxDdm-AtQ",
          icon: "/imgs/icons/link-youtube.svg",
        },
        {
          name: "Discord",
          url: "https://discord.com/invite/SpNEQSSwWv",
          icon: "/imgs/icons/link-discord.svg",
        },
      ],
    },
  ],
  [
    20,
    {
      icon: "/imgs/icons/asset/bfkk.png",
      about:
        "A group of hobbyists who live in Berlin and we like the feelings of the nature.",
      links: [
        {
          name: "Twitter: @sheenhuxin",
          url: "https://twitter.com/sheenhuxin",
          icon: "/imgs/icons/link-twitter.svg",
        },
      ],
    },
  ],
]);

// node => assets info
const assetInfo = new Map([["statemine", statemineInfo]]);

export const getAssetInfo = (node, assetId) => {
  return assetInfo?.get(node)?.get(Number(assetId));
};
