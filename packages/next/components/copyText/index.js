import { useDispatch } from "react-redux";
import styled from "styled-components";
import copy from "copy-to-clipboard";

import Icon from "../../public/imgs/icons/copy.svg";
import { addToast } from "store/reducers/toastSlice";
import { useTheme } from "utils/hooks";

const Wrapper = styled.div`
  display: inline;
  align-items: center;
  line-height: 20px;
  @media screen and (max-width: 580px) {
    display: block;
  }
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
  stroke: ${(p) => p.themecolor};
  stroke-width: 1.5;
`;

export default function CopyText({ children, text }) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const onCopy = () => {
    if (text && copy(text)) {
      dispatch(addToast({ type: "success", message: "Copied" }));
    }
  };

  return (
    <Wrapper>
      <span>{children}</span>
      <StyledIcon themecolor={theme.color} onClick={onCopy} />
    </Wrapper>
  );
}
