import styled, { css } from "styled-components";
import AssetTimelineItem from "./assetTimelineItem";
import Pagination from "../pagination";

import { card_border } from "styles/textStyles";
import { calcPagination } from "utils";
import { PAGE_OFFSET } from "utils/constants";

const Wrapper = styled.div`
  ${card_border};
  padding: 0 24px;
  background-color: #ffffff;

  ${(p) =>
    p.isLastPage &&
    css`
      .asset-timeline-item:last-child {
        .bot-line {
          visibility: hidden;
        }
      }
    `}
`;

const FooterWrapper = styled.div`
  border-top: 1px solid #f8f8f8;
  padding: 14px 24px;
  margin: 0 -24px;
  display: flex;
  justify-content: flex-end;
`;

export default function AssetTimeline({ data, node, asset, meta }) {
  const { isLastPage } = calcPagination({
    offset: PAGE_OFFSET,
    ...meta,
  });

  return (
    <Wrapper isLastPage={isLastPage}>
      <div>
        {(data || []).map((item, index) => {
          return (
            <AssetTimelineItem
              key={index}
              data={item}
              node={node}
              asset={asset}
            />
          );
        })}
      </div>
      <FooterWrapper>
        <Pagination
          page={meta?.page}
          pageSize={meta?.pageSize}
          total={meta?.total}
        />
      </FooterWrapper>
    </Wrapper>
  );
}
