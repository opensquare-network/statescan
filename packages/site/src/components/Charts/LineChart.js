import { Axis, Chart, LineAdvance, Tooltip } from "bizcharts";

export default function LineChart({ data = [], color = "#F22279" }) {
  return (
    <Chart padding={[0, 0, 0, 0]} width={227} height={48} data={data}>
      <Axis name="time" visible={false} />
      <Axis name="price" visible={false} />
      <LineAdvance
        shape="smooth"
        area
        position="time*price"
        color={color}
        tooltip={[
          "time*price",
          (time, price) => {
            return {
              title: "2021-06-22",
              name: "Price",
              value: `$${price}`,
            };
          },
        ]}
      />
      <Tooltip />
    </Chart>
  );
}
