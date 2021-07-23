import { useDispatch } from "react-redux";
import styled from "styled-components";
import copy from "copy-to-clipboard";
import { useSelector } from "react-redux";

import Icon from "../../public/imgs/icons/copy.svg";
import { addToast } from "store/reducers/toastSlice";
import { themeSelector } from "store/reducers/themeSlice";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  line-height: 24px;
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
`;

export default function CopyText({ children, text }) {
  const dispatch = useDispatch();
  const theme = useSelector(themeSelector);

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
