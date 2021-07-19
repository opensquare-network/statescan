import styled, { css } from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";

import Table from "components/table";
import { encodeURIQuery } from "../utils";

const TabWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  > :not(:first-child) {
    margin-left: 40px;
  }
`;

const Tab = styled.a`
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

export default function TabTable({ data, activeTab, collapse }) {
  const router = useRouter();
  const activeTabIndex = data
    .map((item) => item.name.toLowerCase())
    .indexOf(activeTab);

  return (
    <div>
      <TabWrapper>
        {(data || []).map((item, index) => (
          <Link
            key={index}
            href={`${router.pathname}?${encodeURIQuery({
              node: router.query.node,
              id: router.query.id,
              tab: data?.[index]?.name.toLowerCase(),
            })}`}
            passHref
          >
            <Tab active={activeTabIndex === index}>
              <TabText active={activeTabIndex === index}>
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
              {item.total !== undefined && item.total !== null && (
                <TabTag>{item.total}</TabTag>
              )}
            </Tab>
          </Link>
        ))}
      </TabWrapper>
      {data?.[activeTabIndex]?.component ? (
        data?.[activeTabIndex]?.component
      ) : (
        <Table
          head={data?.[activeTabIndex]?.head}
          body={data?.[activeTabIndex]?.body}
          foot={data?.[activeTabIndex]?.foot}
          collapse={collapse}
          expand={data?.[activeTabIndex]?.expand}
        />
      )}
    </div>
  );
}
