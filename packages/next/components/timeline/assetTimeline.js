import styled from "styled-components";
import AssetTimelineItem from "./assetTimelineItem";

import { card_border } from "styles/textStyles";
import { useTheme } from "utils/hooks";

const Wrapper = styled.div`
  ${card_border};
  padding: 0 24px;
  background-color: #ffffff;
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

export default function AssetTimeline({ data, node, asset }) {
  const { color } = useTheme();

  return (
    <Wrapper>
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
