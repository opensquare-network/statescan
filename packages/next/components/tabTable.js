import { useState } from "react";
import styled, { css } from "styled-components";

import Table from "components/table";

const TabWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  overflow: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  > :not(:first-child) {
    margin-left: 40px;
  }
`;

const Tab = styled.div`
  cursor: pointer;
  display: flex;
  align-items: flex-start;

  > :not(:first-child) {
    margin-left: 8px;
  }

  svg {
    margin-top: 11px;

    * {
      fill: none;
    }

    ${(p) =>
      p.active &&
      css`
        * {
          fill: #f22279;
        }
      `}
  }
`;

const TabText = styled.div`
  text-align: center;
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
  height: 18px;
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
          <Tab
            key={index}
            onClick={() => setTabIndex(index)}
            active={tabIndex === index}
          >
            <TabText active={tabIndex === index}>
              {item.name}
              <br />
              <svg
                width="49"
                height="3"
                viewBox="0 0 49 3"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0.5" width="48" height="3" fill="#F22279" />
              </svg>
            </TabText>
            <TabTag>{item.total ?? 0}</TabTag>
          </Tab>
        ))}
      </TabWrapper>
      <Table
        head={data?.[tabIndex]?.head}
        body={data?.[tabIndex]?.body}
        foot={data?.[tabIndex]?.foot}
        isLoading={data?.[tabIndex]?.isLoading}
        collapse={collapse}
      />
    </div>
  );
}
