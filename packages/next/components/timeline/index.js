import styled from "styled-components";
import TimelineItem from "./timelineItem";

import { card_border } from "styles/textStyles";

const Wrapper = styled.div`
  ${card_border};
  padding: 0 24px;
  background-color: #ffffff;
`;

export default function Timeline({ data, node, asset }) {
  return (
    <Wrapper>
      {(data || []).map((item, index) => {
        return (
          <TimelineItem key={index} data={item} node={node} asset={asset} />
        );
      })}
    </Wrapper>
  );
}
