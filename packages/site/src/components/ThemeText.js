import styled, { css } from "styled-components";

import { useNode } from "utils/hooks";

const Wrapper = styled.div`
  color: #f22279;
  ${(p) =>
    p.node === "kusama" &&
    css`
      color: #265deb;
    `}
`;

export default function ThemeText({ children }) {
  const node = useNode();
  return <Wrapper node={node}>{children}</Wrapper>;
}
