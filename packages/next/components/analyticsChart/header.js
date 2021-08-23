import styled, { css } from "styled-components";

const Wrapper = styled.div`
  margin-bottom: 24px;
  > :not(:first-child) {
    margin-top: 24px;
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AssetWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
`;

const Divider = styled.div`
  width: 1px;
  height: 12px;
  background: #dddddd;
  margin: 0 16px;
`;

const RangeWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const RangeItem = styled.div`
  width: 48px;
  height: 20px;
  line-height: 20px;
  background: #eeeeee;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  ${(p) =>
    p.active &&
    css`
      background: #fee4ef;
      color: #f22279;
    `}
`;

const Label = styled.div`
  font-size: 13px;
  line-height: 16px;
  color: rgba(17, 17, 17, 0.65);
`;

export default function ({ symbol, name, range, setRange }) {
  return (
    <Wrapper>
      <FlexWrapper>
        <AssetWrapper>
          <div>{symbol}</div>
          <Divider />
          <div>{name}</div>
        </AssetWrapper>
        <RangeWrapper>
          <RangeItem active={range === "1m"} onClick={() => setRange("1m")}>
            1m
          </RangeItem>
          <RangeItem active={range === "1y"} onClick={() => setRange("1y")}>
            1y
          </RangeItem>
          <RangeItem active={range === "all"} onClick={() => setRange("all")}>
            All
          </RangeItem>
        </RangeWrapper>
      </FlexWrapper>
      <FlexWrapper>
        <Label>Amount</Label>
        <Label>Transfer Counts</Label>
      </FlexWrapper>
    </Wrapper>
  );
}
