import styled from "styled-components";
import Link from "next/link";
import { useSelector } from "react-redux";

import { themeSelector } from "store/reducers/themeSlice";

const StyledLink = styled.a`
  color: ${(p) => p.themeColor};
  cursor: pointer;
  text-decoration: none;
`;

export default function InLink({ to, children }) {
  const theme = useSelector(themeSelector);

  return (
    <Link href={to} passHref>
      <StyledLink themeColor={theme.color}>{children}</StyledLink>
    </Link>
  );
}
