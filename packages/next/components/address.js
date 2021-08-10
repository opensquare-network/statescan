import styled, { css } from "styled-components";
import Tooltip from "components/tooltip";
import MonoText from "./monoText";
import Link from "next/link";
import { useNode, useTheme } from "utils/hooks";
import IdentityLink from "./account/identityLink";
import { fetchIdentity } from "services/identity";
import { useEffect, useState } from "react";
import { nodes } from "utils/constants";

const StyledLink = styled.div`
  word-break: break-all;
  color: ${(p) => p.themecolor};
  cursor: default;
  ${(p) =>
    p.cursor === "true" &&
    css`
      cursor: pointer;
    `}
`;

export default function Address({ address, to }) {
  const node = useNode();
  const theme = useTheme();
  const [identity, setIdentity] = useState(null);

  const relayChain = nodes.find((item) => item.value === node)?.sub?.toLowerCase() || "kusama";

  useEffect(() => {
    fetchIdentity(relayChain, address).then(identity => setIdentity(identity));
  }, [relayChain, address]);

  const styledLink = (
    <StyledLink themecolor={theme.color} cursor={to ? "true" : "false"}>
      {address}
    </StyledLink>
  );

  if (!identity) {
    return (
      to ? (
        <Link href={to} passHref>
          <MonoText>{styledLink}</MonoText>
        </Link>
      ) : (
        <MonoText>{styledLink}</MonoText>
      )
    );
  }

  const identityDisplay = (
    <span>
      {identity && <>
        {identity?.info?.display}
        <br/>
      </>}
      {address}
    </span>
  );

  const identityLink = <IdentityLink identity={identity} width={"auto"} cursor={to ? "true" : "false"} />;

  return (
    <Tooltip content={identityDisplay} isCopy>
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
