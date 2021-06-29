import { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import { Link, useLocation } from "react-router-dom";

import NodeSwitcher from "components/NodeSwitcher";
import { useHomePage } from "utils/hooks";
import Subheader from "./Subheader";
import SearchS from "../Search/search-s";
import { useNode } from "utils/hooks";
import { ReactComponent as Icon } from "./icon.svg";
import { ReactComponent as IconActive } from "./icon-active.svg";
import { useOnClickOutside, useWindowSize } from "utils/hooks";

const Container = styled.header`
  position: relative;
  padding: 0 2rem;
  @media screen and (max-width: 1200px) {
    padding: 0 1.5rem;
  }
`;

const Wrapper = styled.div`
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Background = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  z-index: -1;
  height: 320px;
  background: linear-gradient(180deg, #eeeeee 0%, #ffffff 100%);
  ${(p) =>
    p.isHomePage &&
    css`
      height: 464px;
    `};
`;

const Masked = styled.div`
  width: 100%;
  height: 100%;
  opacity: 0.8;
  position: relative;
  top: -8px;
  background: radial-gradient(
    39.66% 101.89% at 50.29% 24.73%,
    rgba(255, 255, 255, 0) 0%,
    rgba(221, 221, 221, 0.32) 100%
  );
  -webkit-mask-image: url("/imgs/pattern-dot.svg");
  mask-image: url("/imgs/pattern-dot.svg");
  -webkit-mask-repeat: repeat;
  mask-repeat: repeat;
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

const MenuItem = styled(Link)`
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

export default function Header() {
  const location = useLocation();
  const node = useNode();
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
    <>
      <Container>
        <Background isHomePage={isHomePage}>
          <Masked />
        </Background>
        <Wrapper>
          <FlexWrapper>
            <IconWrapper
              isActive={isActive}
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? <IconActive /> : <Icon />}
            </IconWrapper>
            <Link to={`/${node}`}>
              <img src="/imgs/logo.svg" alt="logo" />
            </Link>
            {(isActive || width > 900) && (
              <MenuWrapper ref={ref}>
                <MenuItem
                  to={`/${node}`}
                  onClick={() => setIsActive(false)}
                  selected={location.pathname === `/${node}`}
                >
                  Home
                </MenuItem>
                <MenuItem
                  to={`/${node}/assets`}
                  onClick={() => setIsActive(false)}
                  selected={location.pathname === `/${node}/assets`}
                >
                  Asset
                </MenuItem>
              </MenuWrapper>
            )}
          </FlexWrapper>
          <FlexWrapper>
            <SearchS />
            <NodeSwitcher />
          </FlexWrapper>
        </Wrapper>
      </Container>
      {isHomePage && <Subheader />}
    </>
  );
}
