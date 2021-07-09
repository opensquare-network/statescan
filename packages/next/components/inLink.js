import styled from "styled-components";
import Link from "next/link";

const StyledLink = styled.a`
  color: #f22279;
  cursor: pointer;
  text-decoration: none;
  ${(p) =>
    p.node === "kusama" &&
    css`
      color: #265deb;
    `}
`;

export default function InLink({ to, children }) {
  return (
    <Link href={to} passHref>
      <StyledLink>{children}</StyledLink>
    </Link>
  );
}
