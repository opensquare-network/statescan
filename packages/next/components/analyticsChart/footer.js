import styled, { css } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  margin-top: 24px;
  cursor: pointer;
  > :not(:first-child) {
    margin-left: 24px;
  }
`;

const Item = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  ${(p) =>
    p.hidden &&
    css`
      * {
        color: #dddddd !important;
      }
      > :first-child * {
        background: #dddddd !important;
      }
    `}
`;

const Icon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: 4px;
  ${(p) =>
    p.color &&
    css`
      > * {
        background: ${p.color};
      }
    `}
`;

const Bar = styled.div`
  width: 15px;
  height: 2px;
  position: absolute;
`;

const Circle = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  position: absolute;
`;

export default function Footer({
  amountHidden,
  countHidden,
  holdersHidden,
  setAmountHidden,
  setCountHidden,
  setHoldersHidden,
}) {
  return (
    <Wrapper>
      <Item
        hidden={amountHidden}
        onClick={() => setAmountHidden(!amountHidden)}
      >
        <Icon color="#F33484">
          <Bar />
          <Circle />
        </Icon>
        <div>Transfer Amount</div>
      </Item>
      <Item hidden={countHidden} onClick={() => setCountHidden(!countHidden)}>
        <Icon color="#52CC8A">
          <Bar />
          <Circle />
        </Icon>
        <div>Transfer Count</div>
      </Item>
      <Item
        hidden={holdersHidden}
        onClick={() => setHoldersHidden(!holdersHidden)}
      >
        <Icon color="#1FABE8">
          <Bar />
          <Circle />
        </Icon>
        <div>Holders</div>
      </Item>
    </Wrapper>
  );
}
