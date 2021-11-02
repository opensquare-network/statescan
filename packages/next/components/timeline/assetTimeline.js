import styled from "styled-components";
import AssetTimelineItem from "./assetTimelineItem";

import { card_border } from "styles/textStyles";

const Wrapper = styled.div`
  ${card_border};
  padding: 0 24px;
  background-color: #ffffff;
`;

export default function AssetTimeline({ data, node, asset }) {
  return (
    <Wrapper>
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
    </Wrapper>
  );
}
