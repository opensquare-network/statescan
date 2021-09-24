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
            {timeType === timeTypes.date ? timeDuration(ts) : time(ts)}
          </Wrapper>
        }
      >
        <div>{timeType === timeTypes.date ? time(ts) : timeDuration(ts)}</div>
      </Tooltip>
    </Wrapper>
  );
}
