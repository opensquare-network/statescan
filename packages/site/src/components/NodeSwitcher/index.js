import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";

import { useOnClickOutside } from "utils/hooks";
import { nodeSelector, setNode } from "store/reducers/nodeSlice";

const Wrapper = styled.div`
  position: relative;
`;

const Dropdown = styled.div`
  height: 36px;
  width: 156px;
  background: #ffffff;
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
  font-size: 16px;
  line-height: 20px;
  color: #111111;
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
  width: 100%;
  position: absolute;
  top: 44px;
  left: 0;
`;

const Item = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
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

const options = [
  {
    name: "Polkadot",
    icon: "/imgs/icons/polkadot.svg",
    value: "polkadot",
  },
  {
    name: "Kusama",
    icon: "/imgs/icons/kusama.svg",
    value: "kusama",
  },
  {
    name: "Rococo",
    icon: "/imgs/icons/rococo.png",
    value: "rococo",
  },
];

export default function NodeSwitcher() {
  const dispatch = useDispatch();
  const node = useSelector(nodeSelector);
  const [currentNode, setCurrentNode] = useState();
  const [show, setShow] = useState(false);
  const ref = useRef();
  const location = useLocation();
  const history = useHistory();
  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    setCurrentNode(() => options.find((item) => item.value === node));
  }, [node]);

  useEffect(() => {
    if (node) {
      const newPathname = location.pathname.replace(/^\/\w+/, `/${node}`);
      if (newPathname !== location.pathname) {
        history.replace(newPathname);
      }
    }
  }, [node, location, history]);

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
          {options.map((item, index) => (
            <Item
              key={index}
              active={item.value === currentNode?.value}
              onClick={() => {
                if (item.value !== currentNode?.value) {
                  dispatch(setNode(item.value));
                }
                setShow(false);
              }}
            >
              <Icon src={item.icon} alt={item.value} />
              <Text>{item.name}</Text>
            </Item>
          ))}
        </Options>
      )}
    </Wrapper>
  );
}
