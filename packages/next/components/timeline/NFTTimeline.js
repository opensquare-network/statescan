import styled from "styled-components";
import NFTTimelineItem from "./NFTTimelineItem";

import { card_border } from "styles/textStyles";

const Wrapper = styled.div`
  ${card_border};
  padding: 0 24px;
  background-color: #ffffff;
  text-transform: capitalize;
`;

function sortTimeline(data) {
  data?.sort((itemA, itemB) => {
    const {
      blockHeight: blockHeightA,
      extrinsicIndex: extrinsicIndexA,
      eventIndex: eventIndexA
    } = itemA.indexer;
    const {
      blockHeight: blockHeightB,
      extrinsicIndex: extrinsicIndexB,
      eventIndex: eventIndexB
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

export default function NFTTimeline({ data, node, asset }) {
  sortTimeline(data);

  return (
    <Wrapper>
      {(data || []).map((item, index) => {
        return (
          <NFTTimelineItem key={index} data={item} node={node} asset={asset} />
        );
      })}
    </Wrapper>
  );
}
