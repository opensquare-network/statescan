import styled from "styled-components";
import LineChart from "components/charts/lineChart";
import { useEffect, useRef, useState } from "react";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #f8f8f8;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-radius: 8px;
  padding: 39px 64px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  @media screen and (max-width: 900px) {
    padding: 24px 24px 0;
    > * {
      margin-bottom: 24px;
    }
  }
`;

const ItemWrapper = styled.div`
  min-width: 130px;
  text-align: center;
  @media screen and (max-width: 900px) {
    width: 130px;
  }
`;

const Title = styled.p`
  font-size: 14px;
  line-height: 16px;
  color: rgba(17, 17, 17, 0.35);
  margin: 0 0 8px;
`;

const Text = styled.p`
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  color: #111111;
  margin: 0;
`;

const Divider = styled.div`
  width: 1px;
  background: #f4f4f4;
  @media screen and (max-width: 900px) {
    width: 100%;
    height: 1px;
  }
`;

const ChartWrapper = styled.div`
  width: 227px;
  height: 48px;
  @media screen and (max-width: 900px) {
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
        <Title>Block Height</Title>
        <Text>{blocksHeightDynamic?.toLocaleString()}</Text>
      </ItemWrapper>
      <ItemWrapper>
        <Title>Assets</Title>
        <Text>{assetsCountDynamic?.toLocaleString()}</Text>
      </ItemWrapper>
      <ItemWrapper>
        <Title>Transfers</Title>
        <Text>{transfersCountDynamic?.toLocaleString()}</Text>
      </ItemWrapper>
      <ItemWrapper>
        <Title>Holders</Title>
        <Text>{holdersCountDynamic?.toLocaleString()}</Text>
      </ItemWrapper>
      <Divider />
      <div />
      <ChartWrapper>
        <LineChart token={token} data={chartData} color={color} />
      </ChartWrapper>
    </Wrapper>
  );
}
