import styled, { css } from "styled-components";
import { hashEllipsis } from "../utils";
import Tooltip from "./tooltip";
import MonoText from "./monoText";
import Link from "next/link";
import { useTheme } from "utils/hooks";

const StyledLink = styled.div`
  color: ${(p) => p.themecolor};
  ${(p) =>
    p.cursor === "true" &&
    css`
      cursor: pointer;
    `}
`;

export default function HashEllipsis({ hash, to }) {
  const theme = useTheme();

  return (
    <Tooltip content={hash} isCopy>
      {to ? (
        <Link href={to} passHref>
          <a>
            <StyledLink themecolor={theme.color} cursor={"true"}>
              <MonoText>{hashEllipsis(hash)}</MonoText>
            </StyledLink>
          </a>
        </Link>
      ) : (
        <StyledLink themecolor={theme.color} cursor={"false"}>
          <MonoText>{hashEllipsis(hash)}</MonoText>
        </StyledLink>
      )}
    </Tooltip>
  );
}
