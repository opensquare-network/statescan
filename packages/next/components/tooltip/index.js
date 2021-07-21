import styled, { css } from "styled-components";
import { useDispatch } from "react-redux";
import copy from "copy-to-clipboard";

import { ReactComponent as Icon } from "./icon.svg";
import { addToast } from "store/reducers/toastSlice";

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
  ${(p) =>
    p.isCopy &&
    css`
      cursor: pointer;
    `}
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
  word-wrap: break-word;
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

const ChildrenWrapper = styled.div`
  position: relative;
  display: inline-block;
  :hover {
    > * {
      display: block;
    }
  }
`;

export default function Tooltip({ label, bg, content, children, isCopy }) {
  const dispatch = useDispatch();

  const onCopy = () => {
    if (isCopy && content && copy(content)) {
      dispatch(addToast({ type: "success", message: "Copied" }));
    }
  };

  return (
    <>
      {children ? (
        <ChildrenWrapper>
          {children}
          {content && (
            <PopupWrapper onClick={onCopy} isCopy>
              <Popup>
                {content}
                <Triangle />
              </Popup>
            </PopupWrapper>
          )}
        </ChildrenWrapper>
      ) : (
        <Wrapper bg={bg}>
          {label && label}
          {!label && <Icon />}
          {content && (
            <PopupWrapper onClick={onCopy} isCopy>
              <Popup>
                {content}
                <Triangle />
              </Popup>
            </PopupWrapper>
          )}
        </Wrapper>
      )}
    </>
  );
}
