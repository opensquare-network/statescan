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
  &:hover {
    color: rgba(17, 17, 17, 0.65);
  }
`;

export default function TimeHead({ timeType, setTimeType }) {
  return (
    <Wrapper>
      {timeType === timeTypes.age ? (
        <Item onClick={() => setTimeType(timeTypes.date)}>Age</Item>
      ) : (
        <Item onClick={() => setTimeType(timeTypes.age)}>Date Time</Item>
      )}
    </Wrapper>
  );
}
