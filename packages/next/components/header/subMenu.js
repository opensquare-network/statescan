import { useState, useEffect, useRef, Fragment } from "react";
import styled, { css } from "styled-components";
import { useRouter } from "next/router";
import Link from "next/link";

import ArrowDown from "./arrow-down.svg";
import { useWindowSize } from "utils/hooks";
import { useTheme } from "utils/hooks";
import { card_border, text_dark_placeholder } from "styles/textStyles";

const Wrapper = styled.div`
  position: relative;
  :not(:first-child) {
    margin-left: 40px;
  }
  @media screen and (max-width: 900px) {
    :not(:first-child) {
      margin-left: 0;
    }
  }
`;

const TitleWrapper = styled.div`
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  text-decoration: none;
  color: #111111;
  cursor: pointer;
  :hover {
    color: ${(p) => p.themecolor};
    > svg {
      stroke: ${(p) => p.themecolor};
    }
  }
  display: flex;
  align-items: center;
  > svg {
    stroke: #111111;
    stroke-width: 1.5;
  }
  ${(p) =>
    p.isActive &&
    css`
      color: ${(p) => p.themecolor};
      > svg {
        stroke: ${(p) => p.themecolor};
      }
    `}
  @media screen and (max-width: 900px) {
    padding: 6px 12px;
    cursor: auto;
    :hover {
      color: inherit;
    }
    > svg {
      display: none;
    }
  }
`;

const MouseWrapper = styled.div`
  z-index: 99;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 10px;
  @media screen and (max-width: 900px) {
    position: static;
    left: 0;
    transform: none;
  }
`;

const MenuWrapper = styled.div`
  min-width: 136px;
  background: #ffffff;
  ${card_border};
  padding: 8px 0;
  @media screen and (max-width: 900px) {
    position: static;
    box-shadow: none;
    transform: none;
    padding: 0;
  }
`;

const MenuItem = styled.div`
  cursor: pointer;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  :hover {
    background: #fafafa;
  }
  @media screen and (max-width: 900px) {
    padding: 8px 12px 8px 24px;
    color: rgba(17, 17, 17, 0.65);
  }
  ${(p) =>
    p.selected &&
    css`
      background: #fafafa;
    `}
  ${(p) =>
      p.disabled &&
      css`
        cursor: not-allowed;
        ${text_dark_placeholder};
        pointer-events: none;
    `}
`;

const Divider = styled.div`
  margin: 8px 0;
  height: 1px;
  background: #f8f8f8;
  @media screen and (max-width: 900px) {
    display: none;
  }
`;


export default function SubMenu({ category, menus, closeMenu, divideIndex=2 }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const {width} = useWindowSize();
  const ref = useRef();
  const theme = useTheme();

  useEffect(() => {
    if (width <= 900) {
      setIsActive(false);
    }
  }, [width]);

  const onMouseOver = () => {
    if (width > 900) {
      setIsActive(true);
    }
  };

  const onMouseLeave = () => {
    if (width > 900) {
      setIsActive(false);
    }
  };

  return (
    <Wrapper onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <TitleWrapper isActive={isActive} themecolor={theme.color}>
        {category}
        <ArrowDown/>
      </TitleWrapper>
      {(isActive || width <= 900) && (
        <MouseWrapper>
          <MenuWrapper ref={ref}>
            {menus.map((item, index) => (
              <Fragment key={index}>
                <Link href={`/${item.value}`} passHref>
                  <MenuItem
                    onClick={() => {
                      closeMenu();
                      setIsActive(false);
                    }}
                    selected={router.pathname === `/${item.value}`}
                    disabled={item.value === ""}
                  >
                    {item.name}
                  </MenuItem>
                </Link>
                {index === divideIndex && <Divider/>}
              </Fragment>
            ))}
          </MenuWrapper>
        </MouseWrapper>
      )}
    </Wrapper>
  );
}
