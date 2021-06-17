import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import { nodeSelector } from "store/reducers/nodeSlice";

const Wrapper = styled.a`
  color: #f22279;
  cursor: pointer;
  ${(p) =>
    p.node === "kusama" &&
    css`
      color: #265deb;
    `}
`;

export default function ExLink({ href, children }) {
  const node = useSelector(nodeSelector);
  return (
    <Wrapper node={node} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </Wrapper>
  );
}
