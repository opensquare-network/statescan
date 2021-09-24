import styled from "styled-components";
import AddressEllipsis from "../addressEllipsis";

const Wrapper = styled.div`
  margin-right: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  > :not(:first-child) {
    margin-top: 4px;
  }
`;

const FlexWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
`;

const Amount = styled.span`
  font-size: 14px;
  font-weight: 500;

  color: #111111;
`;

export default function AmountFromTo({ amount, symbol, from, to }) {
  return (
    <Wrapper>
      <FlexWrapper>
        <Amount>
          {amount} {symbol}
        </Amount>
      </FlexWrapper>
      <FlexWrapper>
        <AddressEllipsis address={from} to={`/account/${from}`} />
        <svg
          style={{ marginRight: 12, marginLeft: 12 }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.66663 8.6665H14L9.99996 4.6665"
            stroke="#52CC8A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <AddressEllipsis address={to} to={`/account/${to}`} />
      </FlexWrapper>
    </Wrapper>
  );
}
