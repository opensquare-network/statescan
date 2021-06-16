import styled from "styled-components";
import axios from "axios";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

import { nodeSelector } from "store/reducers/nodeSlice";

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
`;

const Chart = styled.div`
  width: 227px;
  background: #f4f4f4;
`;

export default function Overview() {
  const node = useSelector(nodeSelector);

  const { data: blocksHeightData } = useQuery(
    ["blocksHeight", node],
    async () => {
      const { data } = await axios.get(`${node}/blocks/height`);
      return data;
    },
    {
      enabled: !!node,
    }
  );

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

  return (
    <Wrapper>
      <div>
        <Title>Block Height</Title>
        <Text>{blocksHeightData ?? 0}</Text>
      </div>
      <div>
        <Title>Assets</Title>
        <Text>{assetsCountData ?? 0}</Text>
      </div>
      <div>
        <Title>Transfers</Title>
        <Text>{transfersCountData ?? 0}</Text>
      </div>
      <div>
        <Title>Holders</Title>
        <Text>{holdersCountData ?? 0}</Text>
      </div>
      <Divider />
      <div>
        <Title>DOT Price</Title>
        <Text>$00.00</Text>
      </div>
      <Chart />
    </Wrapper>
  );
}
