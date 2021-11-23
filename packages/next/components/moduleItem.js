import styled from "styled-components";

import { useTheme } from "utils/hooks";

const Wrapper = styled.div`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #ffffff;
  background-color: ${(p) => p.bg ?? "#F22279;"};
`;

export default function ModuleItem({ children }) {
  const theme = useTheme();

  return <Wrapper bg={theme?.color}>{children}</Wrapper>;
}
