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
    16,
    {
      icon: "/imgs/icons/asset/polaris.png",
      about:
        "Polaris is a DAO-driven investment fund focused on the Polkadot ecosystem.",
      links: [
        {
          name: "Twitter",
          url: "https://twitter.com/polaris_dao",
          icon: "/imgs/icons/link-twitter.svg",
        },
        {
          name: "Subsocial",
          url: "https://app.subsocial.network/2316",
          icon: "/imgs/icons/link-subsocial.svg",
        },
        {
          name: "Singular",
          url: "https://singular.rmrk.app/zh/collections/0ce19566b929da831f-POLARIS",
          icon: "/imgs/icons/link-singular.svg",
        },
        {
          name: "Email",
          url: "mailto:polarisdao@protonmail.com",
          icon: "/imgs/icons/link-email.svg",
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
  [
    43,
    {
      icon: "/imgs/icons/asset/danger.png",
      about:
        "DANGER tokens are rewarded to accounts that own NFTs in The Most Dangerous NFT Game collection on RMRK. These tokens will determine the odds of each token holder in the lottery that will take place in 2022.",
      links: [
        {
          name: "Website",
          url: "https://dangerlottery.com/",
          icon: "/imgs/icons/link-default.svg",
        },
        {
          name: "Twitter",
          url: "https://twitter.com/Dangerous_NFT",
          icon: "/imgs/icons/link-twitter.svg",
        },
        {
          name: "Singular",
          url: "https://singular.rmrk.app/collections/9ea8ca9480f9f6df43-DANGER",
          icon: "/imgs/icons/link-default.svg",
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
