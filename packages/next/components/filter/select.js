import { useState, useRef } from "react";
import styled, { css } from "styled-components";

import { useOnClickOutside } from "utils/hooks";
import { card_border } from "styles/textStyles";

const Wrapper = styled.div`
  position: relative;
  @media screen and (max-width: 1100px) {
    flex-grow: 1;
  }
`;

const SelectWrapper = styled.div`
  width: 160px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 400;
  background: #ffffff;
  border-radius: 6px;
  padding: 0 6px 0 12px;
  cursor: pointer;
  border: 1px solid #eeeeee;
  > span {
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  > img {
    margin-left: 8px;
  }
  :hover {
    border-color: #bbbbbb;
  }
  ${(p) =>
    p.isActive &&
    css`
      border-color: #bbbbbb;
      :hover {
        color: inherit;
      }
    `}
  @media screen and (max-width: 1100px) {
    width: auto;
  }
`;

const OptionWrapper = styled.div`
  z-index: 99;
  position: absolute;
  ${card_border};
  padding: 8px 0;
  background: #ffffff;
  min-width: 160px;
  left: 0;
  top: 40px;
  width: 100%;
`;

const OptionItem = styled.div`
  padding: 6px 12px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  :hover {
    background: #fafafa;
  }
  ${(p) =>
    p.isActive &&
    css`
      background: #fafafa;
    `}
`;

export default function Select({ value, options, name, onSelect }) {
  const [isActive, setIsActive] = useState(false);
  const ref = useRef();
  useOnClickOutside(ref, () => setIsActive(false));

  const showText = options.find((item) => item.value === value)?.text;

  return (
    <Wrapper ref={ref}>
      <SelectWrapper onClick={() => setIsActive(!isActive)} isActive={isActive}>
        <span>{showText}</span>
        <img src="/imgs/icons/arrow-down.svg" alt="" />
      </SelectWrapper>
      {isActive && (
        <OptionWrapper>
          {(options || []).map((item, index) => (
            <OptionItem
              key={index}
              isActive={item.value === value}
              onClick={() => {
                setIsActive(false);
                if (item.value === value) return;
                onSelect(name, item.value);
              }}
            >
              {item.text}
            </OptionItem>
          ))}
        </OptionWrapper>
      )}
    </Wrapper>
  );
}
