import styled from "styled-components";
import axios from "axios";
import { useQuery } from "react-query";

import { useNode } from "utils/hooks";
import LineChart from "../Charts/LineChart";
import { useSelector } from "react-redux";
import { scanHeightSelector } from "store/reducers/chainSlice";

const Wrapper = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-radius: 8px;
  padding: 40px 64px;
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
  background: #f4f4f4;
  @media screen and (max-width: 900px) {
    width: 100%;
  }
`;

export default function Overview() {
  const node = useNode();
  const blocksHeightData = useSelector(scanHeightSelector);

  const { data: assetsCountData } = useQuery(
    ["assetsCount", node],
    async () => {
      const { data } = await axios.get(`${node}/assets/count`);
      return data;
    },
    {
      enabled: !!node,
    }
  );

  const { data: transfersCountData } = useQuery(
    ["transfersCount", node],
    async () => {
      const { data } = await axios.get(`${node}/transfers/count`);
      return data;
    },
    {
      enabled: !!node,
    }
  );

  const { data: holdersCountData } = useQuery(
    ["holdersCount", node],
    async () => {
      const { data } = await axios.get(`${node}/holders/count`);
      return data;
    },
    {
      enabled: !!node,
    }
  );

  const chartData = [
    { time: 1, price: 1 },
    { time: 2, price: 1 },
    { time: 3, price: 3 },
    { time: 4, price: 2 },
    {
      time: 5,
      price: 1,
    },
    { time: 6, price: 6 },
  ];

  return (
    <Wrapper>
      <ItemWrapper>
        <Title>Block Height</Title>
        <Text>{blocksHeightData ?? 0}</Text>
      </ItemWrapper>
      <ItemWrapper>
        <Title>Assets</Title>
        <Text>{assetsCountData ?? 0}</Text>
      </ItemWrapper>
      <ItemWrapper>
        <Title>Transfers</Title>
        <Text>{transfersCountData ?? 0}</Text>
      </ItemWrapper>
      <ItemWrapper>
        <Title>Holders</Title>
        <Text>{holdersCountData ?? 0}</Text>
      </ItemWrapper>
      <Divider />
      <ItemWrapper>
        <Title>DOT Price</Title>
        <Text>$00.00</Text>
      </ItemWrapper>
      <ChartWrapper>
        <LineChart data={chartData} color={"#F22279"} />
      </ChartWrapper>
    </Wrapper>
  );
}
