// TODO: if refactor needed, this component now is 95% similar to `assetTimeline`
import styled, { css } from "styled-components";
import NftTimelineItem from "./nftTimelineItem";
import Pagination from "../pagination";
import NoData from "components/table/noData";

import { card_border } from "styles/textStyles";
import { calcPagination } from "utils";
import { PAGE_OFFSET } from "utils/constants";

const Wrapper = styled.div`
  ${card_border};
  padding: 0 24px;
  background-color: #ffffff;
  text-transform: capitalize;

  ${(p) =>
    p.isLastPage &&
    css`
      .nft-timeline-item:last-child {
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

export default function NftTimeline({ data, node, asset, meta }) {
  const { isLastPage } = calcPagination({
    offset: PAGE_OFFSET,
    ...meta,
  });

  if (!data?.length) {
    return (
      <Wrapper>
        <NoData />
      </Wrapper>
    );
  }

  return (
    <Wrapper isLastPage={isLastPage}>
      <div>
        {(data || []).map((item, index) => {
          return (
            <NftTimelineItem
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
