import styled from "styled-components";
import { time, timeDuration } from "utils";
import { timeTypes } from "utils/constants";
import Tooltip from "components/tooltip";

const Wrapper = styled.div`
  white-space: nowrap;
`;

export default function TimeBody({ timeType, ts }) {
  return (
    <Wrapper>
      <Tooltip
        content={
          <Wrapper>
            {timeType === timeTypes.age ? time(ts) : timeDuration(ts)}
          </Wrapper>
        }
      >
        <div>{timeType === timeTypes.age ? timeDuration(ts) : time(ts)}</div>
      </Tooltip>
    </Wrapper>
  );
}
