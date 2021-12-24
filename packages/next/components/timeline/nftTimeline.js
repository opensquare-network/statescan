import styled from "styled-components";
import NftTimelineItem from "./nftTimelineItem";

import { card_border } from "styles/textStyles";
import { useTheme } from "utils/hooks";

const Wrapper = styled.div`
  ${card_border};
  padding: 0 24px;
  background-color: #ffffff;
  text-transform: capitalize;
`;

const ToTopWrapper = styled.div`
  border-top: 1px solid #f8f8f8;
  padding: 14px 24px;
  margin: 0 -24px;
  display: flex;
  justify-content: flex-end;
  > div {
    cursor: pointer;
    color: ${(p) => p.color};
  }
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

export default function NftTimeline({ data, node, asset }) {
  const { color } = useTheme();
  sortTimeline(data);

  return (
    <Wrapper>
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
      <ToTopWrapper color={color}>
        <div
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          Back to Top
        </div>
      </ToTopWrapper>
    </Wrapper>
  );
}
