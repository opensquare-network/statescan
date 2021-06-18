import styled, { css } from "styled-components";
import copy from "copy-to-clipboard";

import { ReactComponent as Icon } from "./copy.svg";
import { useNode } from "utils/hooks";

const Wrapper = styled.div`
  * {
    display: inline;
    vertical-align: top;
  }
  > :first-child {
    margin-right: 8px;
  }
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  stroke: #f22279;
  ${(p) =>
    p.node === "kusama" &&
    css`
      stroke: #265deb;
    `}
`;

export default function CopyText({ children, text }) {
  const node = useNode();
  const onCopy = () => {
    if (text && copy(text)) {
      // TODO toast "Copied"
      console.log("Copied");
    }
  };

  return (
    <Wrapper>
      <span>{children}</span>
      <StyledIcon node={node} onClick={onCopy} />
    </Wrapper>
  );
}
