import styled from "styled-components";

import { useTheme } from "utils/hooks";

const Wrapper = styled.div`
  color: ${(p) => p.themecolor};
`;

export default function ThemeText({ children }) {
  const theme = useTheme();

  return <Wrapper themecolor={theme.color}>{children}</Wrapper>;
}
