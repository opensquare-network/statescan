import styled from "styled-components";
import TimelineItem from "./timelineItem";

const Wrapper = styled.div`
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-radius: 8px;
  padding: 0 24px;
`;

export default function Timeline({ data, node, asset }) {
  return (
    <Wrapper>
      {(data || []).map((item) => {
        return <TimelineItem data={item} node={node} asset={asset} />;
      })}
    </Wrapper>
  );
}
