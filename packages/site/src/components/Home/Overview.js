import styled from "styled-components";
import LineChart from "../Charts/LineChart";
import { useSelector } from "react-redux";
import {
  overviewSelector,
  scanHeightSelector,
} from "store/reducers/chainSlice";
import { useState } from "react";
import axios from "axios";
import { useNode } from "../../utils/hooks";

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
const SubTitle = styled.span`
  font-size: 12px;
  color: rgba(17, 17, 17, 0.2);
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

export default function Overview() {
  const blocksHeightData = useSelector(scanHeightSelector);
  const overviewData = useSelector(overviewSelector);
  const node = useNode();
  const tokenMap = new Map([
    ["westmint", "WND"],
    ["kusama", "KSM"],
    ["polkadot", "DOT"],
  ]);
  const token = tokenMap.get(node) ?? "";

  const [chartData, setChartData] = useState([
    { time: 1, price: 0 },
    { time: 2, price: 0 },
    { time: 3, price: 0 },
    { time: 4, price: 0 },
    { time: 5, price: 0 },
    { time: 6, price: 0 },
  ]);

  axios.get(`/${node}/prices/daily`).then((data) => {
    if (data.length > 0) {
      setChartData(data?.reverse() ?? []);
    }
  });

  return (
    <Wrapper>
      <ItemWrapper>
        <Title>Block Height</Title>
        <Text>{blocksHeightData ?? 0}</Text>
      </ItemWrapper>
      <ItemWrapper>
        <Title>Assets</Title>
        <Text>{overviewData?.assetsCount ?? 0}</Text>
      </ItemWrapper>
      <ItemWrapper>
        <Title>Transfers</Title>
        <Text>{overviewData?.transfersCount ?? 0}</Text>
      </ItemWrapper>
      <ItemWrapper>
        <Title>Holders</Title>
        <Text>{overviewData?.holdersCount ?? 0}</Text>
      </ItemWrapper>
      <Divider />
      <ChartWrapper>
        <LineChart token={token} data={chartData} color={"#F22279"} />
      </ChartWrapper>
    </Wrapper>
  );
}
