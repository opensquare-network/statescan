import { Axis, Chart, LineAdvance, Tooltip } from "bizcharts";
import styled from "styled-components";

const ChartWrapper = styled.div``;

const Title = styled.h2`
  margin: 0;
  font-size: 12px;
  text-align: right;
  color: rgba(17, 17, 17, 0.2);
`;

export default function LineChart({
  token = "",
  data = [],
  color = "#F22279",
}) {
  return (
    <ChartWrapper>
      <Title>{token} · Last 30d</Title>
      <Chart padding={[0, 0, 0, 0]} width={227} height={34} data={data}>
        <Axis name="time" visible={false} />
        <Axis name="price" visible={false} />
        <LineAdvance shape="smooth" area position="time*price" color={color} />
        <Tooltip custom={true} containerTpl={`<i></i>`} />
      </Chart>
    </ChartWrapper>
  );
}
