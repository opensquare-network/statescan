import styled, { css } from "styled-components";

import { ReactComponent as Icon } from "./icon.svg";

const Wrapper = styled.div`
  cursor: pointer;
  display: inline-block;
  position: relative;
  font-size: 14px;
  line-height: 16px;
  color: rgba(17, 17, 17, 0.65);
  > svg {
    stroke-opacity: 0.65;
  }
  :hover {
    color: #111111;
    > svg {
      stroke-opacity: 1;
    }
    > * {
      display: block;
    }
  }
  ${(p) =>
    p.bg &&
    css`
      padding: 6px 12px;
      background: #f4f4f4;
      border-radius: 4px;
      :hover {
        background: #eeeeee;
      }
    `}
`;

const PopupWrapper = styled.div`
  cursor: auto;
  display: none;
  position: absolute;
  padding-bottom: 10px;
  left: 50%;
  bottom: 100%;
  transform: translateX(-50%);
`;

const Popup = styled.div`
  position: relative;
  background: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  max-width: 257px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
`;

const Triangle = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(0, 0, 0, 0.65);
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
`;

export default function Tooltip({ label, bg, content }) {
  return (
    <Wrapper bg={bg}>
      {label && label}
      {!label && <Icon />}
      {content && (
        <PopupWrapper>
          <Popup>
            {content}
            <Triangle />
          </Popup>
        </PopupWrapper>
      )}
    </Wrapper>
  );
}
