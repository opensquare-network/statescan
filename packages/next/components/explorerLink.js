import styled from "styled-components";
import Link from "next/link";
import { useTheme } from "utils/hooks";

const StyledLink = styled.a`
  color: ${(p) => p.themecolor};
  cursor: pointer;
  text-decoration: none;
`;

export default function ExplorerLink({ chain, href, children }) {
  const theme = useTheme();
  const explorerSite = `https://${chain}.subscan.io/`;

  return (
    <Link href={new URL(href, explorerSite).href} target={"_blank"} passHref>
      <StyledLink themecolor={theme.color} target="_blank" rel="noreferrer">{children}</StyledLink>
    </Link>
  );
}
