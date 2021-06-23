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
  return (
    <Wrapper>
      <Item
        active={timeType === timeTypes.age}
        onClick={() => setTimeType(timeTypes.age)}
      >
        Age
      </Item>
      <Divider>·</Divider>
      <Item
        active={timeType === timeTypes.date}
        onClick={() => setTimeType(timeTypes.date)}
      >
        Date Time
      </Item>
    </Wrapper>
  );
}
