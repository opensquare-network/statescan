import styled from "styled-components";
import { useSelector } from "react-redux";

import { themeSelector } from "store/reducers/themeSlice";

const Wrapper = styled.div`
  color: ${(p) => p.themeColor};
`;

export default function ThemeText({ children }) {
  const theme = useSelector(themeSelector);

  return <Wrapper themeColor={theme.color}>{children}</Wrapper>;
}
