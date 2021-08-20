import styled from "styled-components";
import { useEffect } from "react";
import Highcharts from "highcharts/highstock";

const Wrapper = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-radius: 8px;
  overflow: hidden;
`;

export default function Chart({ data }) {
  useEffect(() => {
    Highcharts.stockChart("hightcharts-container", {
      rangeSelector: {
        selected: 4,
      },
      series: data.data,
    });
  }, []);

  return (
    <Wrapper>
      <div id="hightcharts-container" />
    </Wrapper>
  );
}
