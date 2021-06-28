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

const Divider = styled.div`
  margin: 0 8px;
`;

export default function TimeHead({ timeType, setTimeType }) {
  if (timeType === timeTypes.age) {
    return (
      <Item
        active={timeType === timeTypes.age}
        onClick={() => setTimeType(timeTypes.date)}
      >
        Age
      </Item>
    );
  }
  if (timeType === timeTypes.date) {
    return (
      <Item
        active={timeType === timeTypes.date}
        onClick={() => setTimeType(timeTypes.age)}
      >
        Date Time
      </Item>
    );
  }
}
