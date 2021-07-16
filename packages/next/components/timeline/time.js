import styled from "styled-components";

import { time, timeDuration } from "utils";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  line-height: 16px;
  flex-wrap: wrap;
  > :first-child {
    color: rgba(17, 17, 17, 0.65);
  }
  > :last-child {
    margin-top: 4px;
    color: rgba(17, 17, 17, 0.35);
  }
  @media screen and (max-width: 900px) {
    flex-direction: row;
    > :first-child {
      margin-right: 16px;
    }
  }
`;

export default function Time({ ts }) {
  return (
    <Wrapper>
      <div>{time(ts)}</div>
      <div>{timeDuration(ts)}</div>
    </Wrapper>
  );
}
