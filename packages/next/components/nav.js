import styled, { css } from "styled-components";
import { useSelector } from "react-redux";

import { nodeSelector } from "store/reducers/nodeSlice";
import { nodes } from "utils/constants";

const Wrapper = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const NavWrapper = styled.div`
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 8px;
  }
  > :last-child {
    color: #f22279;
  }
  ${(p) =>
    p.node === "kusama" &&
    css`
      > :last-child {
        color: #265deb;
      }
    `}
`;

const StyledLink = styled.div`
  text-decoration: none;
  color: #111111;
  :hover {
    color: #f22279;
  }
  ::after {
    content: "/";
    margin-left: 8px;
    color: rgba(17, 17, 17, 0.35);
  }
  ${(p) =>
    p.node === "kusama" &&
    css`
      :hover {
        color: #265deb;
      }
    `}
`;

const NoLink = styled.div``;

export default function Nav({ data }) {
  const node = useSelector(nodeSelector);

  const nodeName = nodes.find((item) => item.value === node)?.name;

  return (
    <Wrapper>
      <NavWrapper node={node}>
        <StyledLink node={node} to={`/${node}`}>
          {nodeName}
        </StyledLink>
        {(data || []).map((item, index) =>
          item.path ? (
            <StyledLink node={node} to={item.path} key={index}>
              {item.name}
            </StyledLink>
          ) : (
            <NoLink key={index}>{item.name}</NoLink>
          )
        )}
      </NavWrapper>
    </Wrapper>
  );
}
