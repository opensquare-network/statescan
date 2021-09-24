import { useDispatch } from "react-redux";
import styled from "styled-components";
import copy from "copy-to-clipboard";

import Icon from "../../public/imgs/icons/copy.svg";
import { addToast } from "store/reducers/toastSlice";
import { useTheme } from "utils/hooks";

const Wrapper = styled.div`
  display: flex;
  > :first-child {
    margin-right: 8px;
  }
`;

const StyledIcon = styled(Icon)`
  flex-shrink: 0;
  cursor: pointer;
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
      <div>{children}</div>
      <StyledIcon onClick={onCopy} />
    </Wrapper>
  );
}
