import { useState } from "react";
import styled, { css } from "styled-components";

import Table from "components/Table";

const TabWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  > :not(:first-child) {
    margin-left: 40px;
  }
`;

const Tab = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const TabText = styled.div`
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.65);
  ${(p) =>
    p.active &&
    css`
      color: #111111;
    `}
`;

const TabTag = styled.div`
  padding: 1px 8px;
  background: #fee4ef;
  border-radius: 16px;
  font-size: 12px;
  line-height: 16px;
  font-weight: bold;
  color: #f22279;
`;

export default function TabTable({ data, collapse }) {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div>
      <TabWrapper>
        {(data || []).map((item, index) => (
          <Tab key={index} onClick={() => setTabIndex(index)}>
            <TabText active={tabIndex === index}>{item.name}</TabText>
            <TabTag>{item.total}</TabTag>
          </Tab>
        ))}
      </TabWrapper>
      <Table
        head={data?.[tabIndex]?.head}
        body={data?.[tabIndex]?.body}
        collapse={collapse}
      />
    </div>
  );
}
