import { useState, useRef } from "react";
import styled, { css } from "styled-components";

import { useOnClickOutside } from "utils/hooks";
import { nodes } from "utils/constants";

const Wrapper = styled.div`
  position: relative;
  z-index: 9;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Dropdown = styled.div`
  height: 36px;
  width: 156px;
  background: #f4f4f4;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  :hover {
    background: #fafafa;
  }
  ${(p) =>
    p.active &&
    css`
      background: #fafafa;
    `}
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const Text = styled.p`
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #111111;
`;

const Sub = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.35);
`;

const ArrowDown = styled.img`
  width: 24px;
  height: 24px;
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
  right: 6px;
`;

const Options = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.04),
    0px 1.80882px 5.94747px rgba(0, 0, 0, 0.0260636),
    0px 0.751293px 0.932578px rgba(0, 0, 0, 0.02),
    0px 0.271728px 0px rgba(0, 0, 0, 0.0139364);
  border-radius: 8px;
  padding: 8px 0;
  width: 222px;
  position: absolute;
  top: 44px;
  right: 0;
`;

const Item = styled.a`
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  cursor: pointer;
  :hover {
    background: #fafafa;
  }
  ${(p) =>
    p.active &&
    css`
      background: #fafafa;
    `}
`;

export default function NodeSwitcher({ node }) {
  const currentNode = nodes.find((item) => item.value === node);
  const [show, setShow] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => setShow(false));

  return (
    <Wrapper ref={ref}>
      <Dropdown active={show} onClick={() => setShow((state) => !state)}>
        {currentNode && (
          <>
            <Icon src={currentNode.icon} alt={currentNode.value} />
            <Text>{currentNode.name}</Text>
          </>
        )}
        <ArrowDown src="/imgs/icons/arrow-down.svg" />
      </Dropdown>
      {show && (
        <Options>
          {nodes.map((item, index) => (
            <Item
              key={index}
              active={item.value === currentNode?.value}
              onClick={() => {
                if (item.value === currentNode?.value) {
                  location.href = "/";
                } else {
                  window.open(`https://${item.value}.statescan.io`, "_blank");
                }
              }}
            >
              <FlexWrapper>
                <Icon src={item.icon} alt={item.value} />
                <Text>{item.name}</Text>
              </FlexWrapper>
              <Sub>{item.sub}</Sub>
            </Item>
          ))}
        </Options>
      )}
    </Wrapper>
  );
}
