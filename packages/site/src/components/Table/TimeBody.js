import styled from "styled-components";
import { time, timeDuration } from "utils";
import { timeTypes } from "utils/constants";
import { Popup } from "semantic-ui-react";
import "semantic-ui-css/components/popup.min.css";

const Wrapper = styled.div`
  min-width: 150px;
`;

export default function TimeBody({ timeType, ts }) {
  return (
    <Wrapper>
      <Popup
        content={
          <div>{timeType === timeTypes.age ? time(ts) : timeDuration(ts)}</div>
        }
        size="mini"
        trigger={
          <div>{timeType === timeTypes.age ? timeDuration(ts) : time(ts)}</div>
        }
      />
    </Wrapper>
  );
}
