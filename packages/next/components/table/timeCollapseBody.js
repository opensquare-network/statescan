import styled from "styled-components";

import { time, timeDuration } from "utils";

const Wrapper = styled.div`
  font-size: 14px;
  line-height: 20px;
  > :first-child {
    color: rgba(17, 17, 17, 0.65);
  }
  > :nth-child(2) {
    color: rgba(17, 17, 17, 0.35);
  }
`;

export default function TimeCollapseBody({ ts }) {
  return (
    <Wrapper>
      <div>{time(ts)}</div>
      <div>{timeDuration(ts)}</div>
    </Wrapper>
  );
}
