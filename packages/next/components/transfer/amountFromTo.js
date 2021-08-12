import styled from "styled-components";
import AddressEllipsis from "../addressEllipsis";

const Wrapper = styled.div`
  margin-right: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;

  svg {
    margin-left: 12px;
    margin-right: 12px;
  }
`;

const FlexWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const Amount = styled.span`
  font-size: 14px;
  font-weight: 500;

  color: #111111;
`;

export default function AmountFromTo({ node, amount, symbol, from, to }) {
  return (
    <Wrapper>
      <FlexWrapper>
        <Amount>
          {amount} {symbol}
        </Amount>
      </FlexWrapper>
      <AddressEllipsis address={from} to={`/${node}/account/${from}`} />
      <svg
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
      <AddressEllipsis address={to} to={`/${node}/account/${to}`} />
    </Wrapper>
  );
}
