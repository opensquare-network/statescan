import styled from "styled-components";

import { useTheme } from "utils/hooks";

const Wrapper = styled.div`
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
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
