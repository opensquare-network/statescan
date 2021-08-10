import styled, { css } from "styled-components";
import { addressEllipsis } from "utils";
import Tooltip from "components/tooltip";
import MonoText from "./monoText";
import Link from "next/link";
import { useTheme } from "utils/hooks";
import IdentityLink from "./account/identityLink";
import { fetchIdentity } from "services/identity";
import { useEffect, useState } from "react";

const StyledLink = styled.div`
  color: ${(p) => p.themecolor};
  cursor: default;
  ${(p) =>
    p.cursor === "true" &&
    css`
      cursor: pointer;
    `}
`;

export default function AddressEllipsis({ address, to }) {
  const theme = useTheme();
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    fetchIdentity("kusama", address).then(identity => setIdentity(identity));
  }, []);

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

  const identityLink = <IdentityLink identity={identity} cursor={to ? "true" : "false"} />;

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
