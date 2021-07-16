import { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { useRouter } from "next/router";
import Link from "next/link";

import { useOnClickOutside, useWindowSize, useHomePage } from "utils/hooks";
import Icon from "./icon.svg";
import IconActive from "./icon-active.svg";
import NodeSwitcher from "components/nodeSwitcher";
import Subheader from "./subheader";
import SearchS from "components/search/search-s";

const Container = styled.header`
  position: relative;
  padding: 0 2rem;
  @media screen and (max-width: 1200px) {
    padding: 0 1.5rem;
  }
`;

const Wrapper = styled.div`
  height: 86px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(p) =>
    p.isHomePage &&
    css`
      height: 464px;
    `};
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  display: none;
  width: 36px;
  height: 36px;
  background: #f4f4f4;
  border-radius: 8px;
  margin-right: 12px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  padding: 6px;
  > svg {
    stroke: rgba(17, 17, 17, 0.65);
  }
  :hover {
    background: #fafafa;
    > svg {
      stroke: #111111;
    }
  }
  ${(p) =>
    p.isActive &&
    css`
      background: #fafafa;
      > svg {
        stroke: #111111;
      }
    `}
  @media screen and (max-width: 900px) {
    display: block;
  }
`;

const MenuWrapper = styled.div`
  display: flex;
  margin-left: 64px;
  @media screen and (max-width: 900px) {
    position: absolute;
    left: 24px;
    top: 60px;
    margin: 0;
    background: #ffffff;
    box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
      0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
      0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
      0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
    border-radius: 8px;
    padding: 8px 0px;
    flex-direction: column;
    width: 80px;
  }
`;

const MenuItem = styled.div`
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  cursor: pointer;
  text-decoration: none;
  color: #111111;
  :hover {
    color: #f22279;
  }
  :not(:first-child) {
    margin-left: 40px;
  }
  @media screen and (max-width: 900px) {
    padding: 6px 12px;
    :hover {
      color: inherit;
      background: #fafafa;
    }
    :not(:first-child) {
      margin-left: 0;
    }
    ${(p) =>
      p.selected &&
      css`
        background: #fafafa;
      `}
  }
`;

export default function Header({ node }) {
  const router = useRouter();
  const isHomePage = useHomePage();
  const [isActive, setIsActive] = useState(false);
  const { width } = useWindowSize();
  const ref = useRef();
  useOnClickOutside(ref, () => setIsActive(false));

  useEffect(() => {
    if (width > 900) {
      setIsActive(false);
    }
  }, [width]);

  return (
    <Container>
      <Wrapper>
        <FlexWrapper>
          <IconWrapper
            isActive={isActive}
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <IconActive /> : <Icon />}
          </IconWrapper>
          <Link href={`/${node}`}>
            <img
              src="/imgs/logo.svg"
              alt="logo"
              style={{ cursor: "pointer" }}
            />
          </Link>
          {(isActive || width > 900) && (
            <MenuWrapper ref={ref}>
              <Link href={`/${node}`}>
                <MenuItem
                  onClick={() => setIsActive(false)}
                  selected={router.pathname === "/[node]"}
                >
                  Home
                </MenuItem>
              </Link>
              <Link href={`/${node}/assets`}>
                <MenuItem
                  onClick={() => setIsActive(false)}
                  selected={location.pathname === "/[node]/assets"}
                >
                  Assets
                </MenuItem>
              </Link>
            </MenuWrapper>
          )}
        </FlexWrapper>
        <FlexWrapper>
          <SearchS />
          <NodeSwitcher node={node} />
        </FlexWrapper>
      </Wrapper>
      {isHomePage && <Subheader />}
    </Container>
  );
}
