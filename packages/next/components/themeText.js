import styled from "styled-components";
import { useSelector } from "react-redux";

import { themeSelector } from "store/reducers/themeSlice";

const Wrapper = styled.div`
  color: ${(p) => p.themecolor};
`;

export default function ThemeText({ children }) {
  const theme = useSelector(themeSelector);

  return <Wrapper themecolor={theme.color}>{children}</Wrapper>;
}
