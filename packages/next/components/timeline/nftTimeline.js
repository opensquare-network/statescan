import styled from "styled-components";
import NftTimelineItem from "./nftTimelineItem";

import { card_border } from "styles/textStyles";

const Wrapper = styled.div`
  ${card_border};
  padding: 0 24px;
  background-color: #ffffff;
  text-transform: capitalize;
`;

export default function NftTimeline({ data, node, asset }) {
  return (
    <Wrapper>
      {(data || []).map((item, index) => {
        return (
          <NftTimelineItem key={index} data={item} node={node} asset={asset} />
        );
      })}
    </Wrapper>
  );
}
