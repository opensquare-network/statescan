import { useDispatch } from "react-redux";
import styled from "styled-components";
import copy from "copy-to-clipboard";

import Icon from "../../public/imgs/icons/copy.svg";
import { addToast } from "store/reducers/toastSlice";
import { useTheme } from "utils/hooks";

const Wrapper = styled.div`
  display: flex;
  line-height: 20px;
  > :first-child {
    margin-right: 8px;
  }
  :hover {
    svg {
      display: block;
    }
  }
`;

const StyledIcon = styled(Icon)`
  flex-shrink: 0;
  cursor: pointer;
  display: none;
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
      {children}
      <StyledIcon onClick={onCopy} />
    </Wrapper>
  );
}
