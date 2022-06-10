import styled, { css } from "styled-components";
import NftTimelineItem from "./nftTimelineItem";
import Pagination from "../pagination";

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

function sortTimeline(data) {
  data?.sort((itemA, itemB) => {
    const {
      blockHeight: blockHeightA,
      extrinsicIndex: extrinsicIndexA,
      eventIndex: eventIndexA,
    } = itemA.indexer;
    const {
      blockHeight: blockHeightB,
      extrinsicIndex: extrinsicIndexB,
      eventIndex: eventIndexB,
    } = itemB.indexer;

    if (blockHeightA > blockHeightB) {
      return 1;
    }
    if (blockHeightA < blockHeightB) {
      return -1;
    }
    if (extrinsicIndexA > extrinsicIndexB) {
      return 1;
    }
    if (extrinsicIndexA < extrinsicIndexB) {
      return -1;
    }
    if (eventIndexA > eventIndexB) {
      return 1;
    }
    if (eventIndexA < eventIndexB) {
      return -1;
    }
    return 0;
  });
}

export default function NftTimeline({ data, node, asset, meta }) {
  sortTimeline(data);
  console.log(meta);

  const { isLastPage } = calcPagination({
    offset: PAGE_OFFSET,
    ...meta,
  });

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
