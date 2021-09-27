import styled from "styled-components";

import { time, timeDuration } from "utils";

import CLockIcon from "../../public/imgs/icons/clock.svg";

const Wrapper = styled.div`
  margin-top: 8px;
  display: flex;
  flex-wrap: nowrap;
  font-size: 12px;
  line-height: 16px;
  flex-wrap: nowrap;
  svg {
    margin-right: 4px;
  }

  > div:nth-child(2) {
    margin-right: 8px;
  }

  > div:nth-child(3) {
    color: rgba(17, 17, 17, 0.35);
  }

  > div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export default function Time({ ts }) {
  const roughly = true;
  return (
    <Wrapper>
      <CLockIcon />
      <div>{time(ts)}</div>
      <div>{timeDuration(ts, roughly)}</div>
    </Wrapper>
  );
}
