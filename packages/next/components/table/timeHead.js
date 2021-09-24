import styled, { css } from "styled-components";

import { timeTypes } from "utils/constants";
import { useTheme } from "utils/hooks";

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
    p.color &&
    css`
      color: ${p.color};
    `}
`;

export default function TimeHead({ timeType, setTimeType }) {
  const color = useTheme().color;
  return (
    <Wrapper>
      {timeType === timeTypes.date ? (
        <Item color={color} onClick={() => setTimeType(timeTypes.age)}>
          Date Time
        </Item>
      ) : (
        <Item color={color} onClick={() => setTimeType(timeTypes.date)}>
          Age
        </Item>
      )}
    </Wrapper>
  );
}
