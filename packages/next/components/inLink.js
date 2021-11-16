import styled from "styled-components";
import Link from "next/link";
import { useTheme } from "utils/hooks";

const StyledLink = styled.a`
  color: ${(p) => p.themecolor};
  :hover {
    color: ${(p) => p.themecolor};
  }
  cursor: pointer;
  text-decoration: none;
`;

export default function InLink({ to, children }) {
  const theme = useTheme();

  return (
    <Link href={to} passHref>
      <StyledLink themecolor={theme.color}>{children}</StyledLink>
    </Link>
  );
}
