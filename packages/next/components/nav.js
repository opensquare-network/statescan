import styled, { css } from "styled-components";
import Link from "next/link";

import { nodes } from "utils/constants";
import { useTheme } from "utils/hooks";

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
    color: ${(p) => p.themecolor};
  }
`;

const StyledLink = styled.div`
  cursor: pointer;
  text-decoration: none;
  color: #111111;
  :hover {
    color: ${(p) => p.themecolor};
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

export default function Nav({ data, node }) {
  const nodeName = nodes.find((item) => item.value === node)?.name;
  const theme = useTheme();

  return (
    <Wrapper>
      <NavWrapper node={node} themecolor={theme.color}>
        <Link href={`/`} passHref>
          <StyledLink node={node} themecolor={theme.color}>
            {nodeName}
          </StyledLink>
        </Link>
        {(data || []).map((item, index) =>
          item.path ? (
            <Link href={item.path} key={index} passHref>
              <StyledLink node={node} themecolor={theme.color}>
                {item.name}
              </StyledLink>
            </Link>
          ) : (
            <NoLink key={index}>{item.name}</NoLink>
          )
        )}
      </NavWrapper>
    </Wrapper>
  );
}
