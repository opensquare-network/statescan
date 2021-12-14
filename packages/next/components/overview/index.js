import styled from "styled-components";
import LineChart from "components/charts/lineChart";
import { useEffect, useRef, useState } from "react";
import { card_border } from "styles/textStyles";
import OverviewItem from "./overviewItem";

const Wrapper = styled.div`
  background: #ffffff;
  ${card_border};
  padding: 32px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  @media screen and (max-width: 1200px) {
    padding: 24px 24px;
  }
`;

const ItemWrapper = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  row-gap: 32px;
`;

const Divider = styled.div`
  width: 1px;
  background: #f4f4f4;
  align-self: stretch;
  margin: 0 40px 0 0;
  @media screen and (max-width: 1200px) {
    margin-right: 0;
    width: 100%;
    height: 1px;
    margin: 24px 0;
  }
`;

const ChartWrapper = styled.div`
  width: 367px;
  height: 120px;
  @media screen and (max-width: 1200px) {
    width: 100%;
  }
`;

const easeOutQuart = (t, b, c, d) => {
  return -c * ((t = t / d - 1) * t * t * t - 1) + b;
};

export default function Overview({ node, overviewData, price }) {
  const blocksHeightData = overviewData?.latestBlocks[0]?.header.number;
  const tokenMap = new Map([
    ["westmint", "WND"],
    ["statemine", "KSM"],
    ["polkadot", "DOT"],
  ]);

  const colorMap = new Map([
    ["KSM", "#0f0f0f"],
    ["WND", "#F22279"],
  ]);

  const token = tokenMap.get(node) ?? "";

  const color = colorMap.get(token) ?? "#ddd";

  const chartData = price ?? [];

  const [blocksHeightDynamic, setBlocksHeightDynamic] = useState(0);
  const [assetsCountDynamic, setAssetsCountDynamic] = useState(0);
  const [transfersCountDynamic, setTransfersCountDynamic] = useState(0);
  const [holdersCountDynamic, setHolderCountDynamic] = useState(0);

  const requestRef = useRef();
  const previousTimeRef = useRef();
  const animationDuration = 500;

  useEffect(() => {
    if (overviewData && blocksHeightData) {
      if (
        blocksHeightData === blocksHeightDynamic &&
        overviewData.assetsCount === assetsCountDynamic &&
        overviewData.transfersCount === transfersCountDynamic &&
        overviewData.holdersCount === holdersCountDynamic
      ) {
        return;
      }

      const diffBlocksHeight = blocksHeightData - blocksHeightDynamic;
      const diffAssetsCount = overviewData.assetsCount - assetsCountDynamic;
      const diffTransfersCount =
        overviewData.transfersCount - transfersCountDynamic;
      const diffHoldersCount = overviewData.holdersCount - holdersCountDynamic;

      const tick = (now) => {
        const elapsed = now - previousTimeRef.current;
        if (elapsed >= 0) {
          const progress = easeOutQuart(elapsed, 0, 1, animationDuration);

          setBlocksHeightDynamic(
            blocksHeightDynamic + Math.round(progress * diffBlocksHeight)
          );
          setAssetsCountDynamic(
            assetsCountDynamic + Math.round(progress * diffAssetsCount)
          );
          setTransfersCountDynamic(
            transfersCountDynamic + Math.round(progress * diffTransfersCount)
          );
          setHolderCountDynamic(
            holdersCountDynamic + Math.round(progress * diffHoldersCount)
          );
        }

        if (elapsed < animationDuration) {
          requestRef.current = requestAnimationFrame(tick);
        } else {
          setBlocksHeightDynamic(blocksHeightData);
          setAssetsCountDynamic(overviewData.assetsCount);
          setTransfersCountDynamic(overviewData.transfersCount);
          setHolderCountDynamic(overviewData.holdersCount);
        }
      };

      previousTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(requestRef.current);
    }
    /*eslint-disable */
  }, [blocksHeightData, overviewData]);
  /*eslint-enable */

  return (
    <Wrapper>
      <ItemWrapper>
        <OverviewItem
          title="Block Height"
          icon="blocks.svg"
          link="/blocks"
          text={blocksHeightDynamic?.toLocaleString()}
        />
        <OverviewItem
          title="Transfers"
          icon="transfers.svg"
          link="/transfers"
          text={transfersCountDynamic?.toLocaleString()}
        />
        <OverviewItem
          title="Assets"
          icon="asset.svg"
          link="assets"
          text={assetsCountDynamic?.toLocaleString()}
        />
        <OverviewItem
          title="Holders"
          icon="holder.svg"
          text={holdersCountDynamic?.toLocaleString()}
        />
        <OverviewItem
          title="NFT Class"
          icon="nft-class.svg"
          text="30"
          textSec="32"
          link="nft"
          tip="Recognized / All"
        />
        <OverviewItem
          title="NFT Instance"
          icon="nft-class.svg"
          text="80"
          textSec="100"
          link="nft"
          tip="Recognized / All"
        />
      </ItemWrapper>
      <Divider />
      <ChartWrapper>
        <LineChart token={token} data={chartData} color={color} />
      </ChartWrapper>
    </Wrapper>
  );
}