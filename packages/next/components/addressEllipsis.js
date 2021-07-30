import styled, { css } from "styled-components";
import { addressEllipsis } from "utils";
import Tooltip from "components/tooltip";
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

export default function AddressEllipsis({ address, to }) {
  const theme = useTheme();

  return (
    <Tooltip content={address} isCopy>
      {to ? (
        <Link href={to} passHref>
          <MonoText>
            <StyledLink themecolor={theme.color} cursor={"true"}>
              {addressEllipsis(address)}
            </StyledLink>
          </MonoText>
        </Link>
      ) : (
        <MonoText>
          <StyledLink themecolor={theme.color} cursor={"false"}>
            {addressEllipsis(address)}
          </StyledLink>
        </MonoText>
      )}
    </Tooltip>
  );
}
