import { Axis, Chart, LineAdvance, Tooltip } from "bizcharts";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  svg,
  img {
    margin-top: 17px;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 12px;
  text-align: right;
  color: rgba(17, 17, 17, 0.65);
  font-weight: normal;
  line-height: 16px;
`;

const ChartWrapper = styled.div`
  margin-top: 4px;
  flex-grow: 1;
`;

export default function LineChart({
  token = "",
  data = [],
  color = "#F22279",
}) {
  return (
    <Wrapper>
      <Title>{token} Price History(USDT) · Last 30d</Title>
      {data.length ? (
        <ChartWrapper>
          <Chart data={data} height={100} width={367}>
            <Axis name="time" visible={false} />
            <Axis name="price" visible={false} />
            <LineAdvance
              shape="smooth"
              area
              position="time*price"
              color={color}
            />
            <Tooltip custom={true} containerTpl={`<i></i>`} />
          </Chart>
        </ChartWrapper>
      ) : (
        <img src="/imgs/nochart.svg" alt="NoChartDataLoaded" />
      )}
    </Wrapper>
  );
}
