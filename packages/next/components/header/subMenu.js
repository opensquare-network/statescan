import { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { useRouter } from "next/router";
import Link from "next/link";

import ArrowDown from "./arrow-down.svg";
import { useOnClickOutside, useWindowSize, useNode } from "utils/hooks";

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
    color: #f22279;
    > svg {
      stroke: #f22279;
    }
  }
  display: flex;
  align-items: center;
  > svg {
    margin-left: 4px;
    stroke: #111111;
  }
  ${(p) =>
    p.isActive &&
    css`
      color: #f22279;
      > svg {
        stroke: #f22279;
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

const MenuWrapper = styled.div`
  position: absolute;
  min-width: 170px;
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-radius: 8px;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
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
`;

const menus = [
  {
    name: "View Blocks",
    value: "blocks",
  },
  {
    name: "View Extrinsics",
    value: "extrinsics",
  },
  {
    name: "View Transfers",
    value: "transfers",
  },
  {
    name: "View Events",
    value: "events",
  },
  {
    name: "View Addresses",
    value: "addresses",
  },
];

export default function SubMenu({ closeMenu }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const { width } = useWindowSize();
  const ref = useRef();
  const node = useNode();
  useOnClickOutside(ref, () => setIsActive(false));

  useEffect(() => {
    if (width <= 900) {
      setIsActive(false);
    }
  }, [width]);

  return (
    <Wrapper>
      <TitleWrapper onClick={() => setIsActive(true)} isActive={isActive}>
        BlockChain
        <ArrowDown />
      </TitleWrapper>
      {(isActive || width <= 900) && (
        <MenuWrapper ref={ref}>
          {menus.map((item, index) => (
            <Link key={index} href={`/${node}/${item.value}`}>
              <MenuItem
                onClick={closeMenu}
                selected={router.pathname === `/[node]/${item.value}`}
              >
                {item.name}
              </MenuItem>
            </Link>
          ))}
        </MenuWrapper>
      )}
    </Wrapper>
  );
}
