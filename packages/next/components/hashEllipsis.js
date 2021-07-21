import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import { hashEllipsis } from "../utils";
import Tooltip from "./tooltip";
import MonoText from "./monoText";
import Link from "next/link";
import { themeSelector } from "store/reducers/themeSlice";

const StyledLink = styled.div`
  color: ${(p) => p.themecolor};
  ${(p) =>
    p.cursor &&
    css`
      cursor: pointer;
    `}
`;

export default function HashEllipsis({ hash, to }) {
  const theme = useSelector(themeSelector);

  return (
    <Tooltip content={hash} isCopy>
      {to ? (
        <Link href={to} passHref>
          <MonoText>
            <StyledLink themecolor={theme.color} cursor={true}>
              {hashEllipsis(hash)}
            </StyledLink>
          </MonoText>
        </Link>
      ) : (
        <MonoText>
          <StyledLink themecolor={theme.color} cursor={false}>
            {hashEllipsis(hash)}
          </StyledLink>
        </MonoText>
      )}
    </Tooltip>
  );
}
