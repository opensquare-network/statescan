import { Axis, Chart, LineAdvance } from "bizcharts";

export default function LineChart(data = [], color = "#F22279") {
  return (
    <Chart
      padding={[10, 20, 50, 40]}
      width={227}
      height={48}
      data={[
        {
          time: 1,
          price: 7,
        },
        {
          time: 2,
          price: 3.9,
        },
        {
          time: 3,
          price: 13,
        },
        {
          time: 4,
          price: 4.2,
        },
        {
          time: 5,
          price: 16.5,
        },
        {
          time: 6,
          price: 5.7,
        },
      ]}
    >
      <Axis name="time" visible={false} />
      <Axis name="price" visible={false} />
      <LineAdvance shape="smooth" area position="time*price" color={color} />
    </Chart>
  );
}
