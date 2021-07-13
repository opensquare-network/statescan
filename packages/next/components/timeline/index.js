import styled from "styled-components";
import TimelineItem from "./timelineItem";

const Wrapper = styled.div``;

export default function Timeline({ data }) {
  return (
    <Wrapper>
      {(data || []).map((item) => {
        return <TimelineItem data={item} />;
      })}
    </Wrapper>
  );
}
