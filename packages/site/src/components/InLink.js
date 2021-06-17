import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

import { useNode } from "utils/hooks";

const StyledLink = styled(Link)`
  color: #f22279;
  cursor: pointer;
  text-decoration: none;
  ${(p) =>
    p.node === "kusama" &&
    css`
      color: #265deb;
    `}
`;

export default function InLink({ children, ...props }) {
  const node = useNode();
  return (
    <StyledLink {...props} node={node}>
      {children}
    </StyledLink>
  );
}
