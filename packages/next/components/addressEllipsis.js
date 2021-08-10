import styled, { css } from "styled-components";
import { addressEllipsis } from "utils";
import Tooltip from "components/tooltip";
import MonoText from "./monoText";
import Link from "next/link";
import { useTheme } from "utils/hooks";
import IdentityLink from "./account/identityLink";

const StyledLink = styled.div`
  color: ${(p) => p.themecolor};
  cursor: default;
  ${(p) =>
    p.cursor === "true" &&
    css`
      cursor: pointer;
    `}
`;

export default function AddressEllipsis({ address, to, identity = null }) {
  const theme = useTheme();

  const styledLink = (
    <StyledLink themecolor={theme.color} cursor={to ? "true" : "false"}>
      {addressEllipsis(address)}
    </StyledLink>
  );

  if (!identity) {
    return (
      <Tooltip content={address} isCopy>
        {to ? (
          <Link href={to} passHref>
            <MonoText>{styledLink}</MonoText>
          </Link>
        ) : (
          <MonoText>{styledLink}</MonoText>
        )}
      </Tooltip>
    );
  }

  const identityDisplay = identity ? `${identity?.info?.display} \n` : "";

  const identityLink = <IdentityLink identity={identity} />;

  return (
    <Tooltip content={identityDisplay + address} isCopy>
      {to ? (
        <Link href={to} passHref>
          <MonoText>{identityLink}</MonoText>
        </Link>
      ) : (
        <MonoText>{identityLink}</MonoText>
      )}
    </Tooltip>
  );
}
