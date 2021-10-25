import styled, { css } from "styled-components";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { useTheme, useNode } from "utils/hooks";
import InnerDataTable from "./table/innerDataTable";
import { convertCallForJsonView, convertCallForTableView } from "utils/dataWrapper";
import { makeEventArgs } from "utils/eventArgs";

const JsonView = dynamic(
  () => import("components/jsonView").catch((e) => console.error(e)),
  { ssr: false }
);

const Wrapper = styled.div`
  padding: 32px;
  background: #fafafa;
  border-radius: 4px;
  font-size: 14px;
  line-height: 20px;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-family: "Inter";
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

const Button = styled.div`
  background: #eeeeee;
  border-radius: 4px;
  padding: 2px 4px;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;
  min-width: 48px;
  text-align: center;
  color: rgba(17, 17, 17, 0.65);
  :not(:first-child) {
    margin-left: 8px;
  }
  ${(p) =>
    p.active &&
    css`
      color: ${p.color};
      background-color: ${p.background};
    `}
`;

export default function JsonDisplay({ data, type }) {
  const [displayType, setDisplayType] = useState("table");
  const [tableData, setTableData] = useState({});
  const [jsonData, setJsonData] = useState({});
  const theme = useTheme();
  const node = useNode();

  useEffect(() => {
    const item = window.localStorage.getItem("displayType");
    if (item) {
      setDisplayType(JSON.parse(item));
    }
  }, []);

  useEffect(() => {
    if (type === "extrinsic") {
      setTableData(convertCallForTableView(data));
      setJsonData(convertCallForJsonView(data));
    } else if (type === "event") {
      setTableData(makeEventArgs(node, data));
      setJsonData(makeEventArgs(node, data));
    }
  }, [type, data, node]);

  const onClick = (value) => {
    window.localStorage.setItem("displayType", JSON.stringify(value));
    setDisplayType(value);
  };

  return (
    <Wrapper colSpan="100%">
      <ActionWrapper>
        <Button
          color={theme?.color}
          background={theme?.colorSecondary}
          active={displayType === "table"}
          onClick={() => onClick("table")}
        >
          Table
        </Button>
        <Button
          color={theme?.color}
          background={theme?.colorSecondary}
          active={displayType === "json"}
          onClick={() => onClick("json")}
        >
          Json
        </Button>
      </ActionWrapper>
      <div>
        {displayType === "table" && <InnerDataTable data={tableData} />}
        {displayType === "json" && <JsonView src={jsonData} />}
      </div>
    </Wrapper>
  );
}
