import styled from "styled-components";
import { Link } from "react-router-dom";

import { useNode } from "utils/hooks";

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  font-weight: 500;
  text-decoration: none;
  color: #111111;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

export default function Symbol({ symbol }) {
  const node = useNode();
  return (
    <StyledLink to={`/${node}/asset/${symbol}`}>
      <Icon src="/imgs/icons/default.svg" />
      {symbol}
    </StyledLink>
  );
}
