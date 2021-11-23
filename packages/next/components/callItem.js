import styled from "styled-components";

import { useTheme } from "utils/hooks";

const Wrapper = styled.div`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  background-color: ${(p) => p.bg ?? "#FEE4EF"};
  color: ${(p) => p.color ?? "#F22279"};
`;

export default function CallItem({ children }) {
  const theme = useTheme();

  return (
    <Wrapper bg={theme.colorSecondary} color={theme.color}>
      {children}
    </Wrapper>
  );
}
