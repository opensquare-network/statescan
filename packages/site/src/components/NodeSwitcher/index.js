import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";

import { useOnClickOutside } from "utils/hooks";
import { setNode } from "store/reducers/nodeSlice";
import { useNode } from "utils/hooks";
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
      background: #ffffff;
    `}
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const Text = styled.p`
  font-weight: 600;
  font-size: 16px;
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

const Item = styled.div`
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

export default function NodeSwitcher() {
  const dispatch = useDispatch();
  const node = useNode();
  const [currentNode, setCurrentNode] = useState();
  const [show, setShow] = useState(false);
  const ref = useRef();
  const location = useLocation();
  const history = useHistory();
  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    setCurrentNode(() => nodes.find((item) => item.value === node));
  }, [node]);

  const replacePathname = useCallback(() => {
    const newPathname = location.pathname.replace(/^\/\w+/, `/${node}`);
    if (newPathname !== location.pathname) {
      history.replace(newPathname);
    }
  }, [history, location, node]);

  useEffect(() => {
    if (location.pathname !== "/404" && node) {
      replacePathname();
    }
  }, [node, location, replacePathname]);

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
                dispatch(setNode(item.value));
                replacePathname();
                setShow(false);
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
