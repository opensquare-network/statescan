import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import moment from "moment";

import { fromAssetUnit } from "utils";
import Header from "./header";
import Footer from "./footer";

const Wrapper = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-radius: 8px;
  padding: 24px;
`;

const ChartWrapper = styled.div`
  height: 240px;
`;

export default function AnalyticsChart({ data, symbol, name }) {
  const [range, setRange] = useState("all");
  const [showData, setShowData] = useState(data);
  const [amountHidden, setAmountHidden] = useState(false);
  const [countHidden, setCountHidden] = useState(false);
  const [holdersHidden, setHoldersHidden] = useState(false);

  useEffect(() => {
    if (range === "all") {
      setShowData(data);
    } else if (range === "1m") {
      const ts = moment().subtract(1, "months").valueOf();
      setShowData(data.filter((item) => item.indexer.blockTime > ts));
    } else if (range === "1y") {
      const ts = moment().subtract(1, "years").valueOf();
      setShowData(data.filter((item) => item.indexer.blockTime > ts));
    }
  }, [range]);

  const labels = (showData || []).map((item) => item.indexer.blockTime);
  const transferAmounts = (showData || []).map((item) =>
    fromAssetUnit(item.transferAmount, 10)
  );
  const transferCounts = (showData || []).map((item) => item.transferCount);
  const holderCounts = (showData || []).map((item) => item.holderCount);

  const testData = {
    labels,
    datasets: [
      {
        label: "Transfer Amount",
        data: transferAmounts,
        yAxisID: "a",
        fill: false,
        borderColor: "#F33484",
        pointBackgroundColor: "#F33484",
        pointHoverBorderWidth: 1,
        pointRadius: 0,
        pointHitRadius: 10,
        borderWidth: 2,
        hidden: amountHidden,
      },
      {
        label: "Transfer Count",
        data: transferCounts,
        yAxisID: "b",
        fill: false,
        borderColor: "#52CC8A",
        pointBackgroundColor: "#52CC8A",
        pointHoverBorderWidth: 1,
        pointRadius: 0,
        pointHitRadius: 10,
        borderWidth: 2,
        hidden: countHidden,
      },
      {
        label: "Holders",
        data: holderCounts,
        yAxisID: "b",
        fill: false,
        borderColor: "#1FABE8",
        pointBackgroundColor: "#1FABE8",
        pointHoverBorderWidth: 1,
        pointRadius: 0,
        pointHitRadius: 10,
        borderWidth: 2,
        hidden: holdersHidden,
      },
    ],
  };

  const options = {
    type: "line",
    hover: {
      mode: "nearest",
      intersect: true,
    },
    scales: {
      yAxes: [
        {
          position: "left",
          type: "linear",
          id: "a",
          gridLines: {
            drawBorder: false,
            display: false,
          },
          ticks: {
            callback: function (value) {
              return value / 1000 + "k";
            },
          },
        },
        {
          position: "right",
          type: "linear",
          id: "b",
          gridLines: {
            drawBorder: false,
          },
        },
      ],
      xAxes: [
        {
          type: "time",
          time: {
            displayFormats: {
              day: "MMM, DD",
            },
            unit: "day",
            unitStepSize: 2,
          },
          gridLines: {
            zeroLineWidth: 0,
            color: "rgba(0, 0, 0, 0)",
          },
        },
      ],
    },
    tooltips: {
      mode: "index",
    },
    legend: {
      display: false,
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Wrapper>
      <Header symbol={symbol} name={name} range={range} setRange={setRange} />
      <ChartWrapper>
        <Line data={testData} options={options} />
      </ChartWrapper>
      <Footer
        amountHidden={amountHidden}
        countHidden={countHidden}
        holdersHidden={holdersHidden}
        setAmountHidden={setAmountHidden}
        setCountHidden={setCountHidden}
        setHoldersHidden={setHoldersHidden}
      />
    </Wrapper>
  );
}
