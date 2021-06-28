import styled, { css } from "styled-components";

import { timeTypes } from "utils/constants";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 16px;
  color: rgba(17, 17, 17, 0.35);
`;

const Item = styled.div`
  cursor: pointer;
  ${(p) =>
    p.active &&
    css`
      color: rgba(17, 17, 17, 0.65);
    `}
`;

export default function TimeHead({ timeType, setTimeType }) {
  return (
    <Wrapper>
      {timeType === timeTypes.age ? (
        <Item
          active={timeType === timeTypes.age}
          onClick={() => setTimeType(timeTypes.date)}
        >
          Age
        </Item>
      ) : (
        <Item
          active={timeType === timeTypes.date}
          onClick={() => setTimeType(timeTypes.age)}
        >
          Date Time
        </Item>
      )}
    </Wrapper>
  );
}
