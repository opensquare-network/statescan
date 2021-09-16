import styled, { css } from "styled-components";
import Tooltip from "components/tooltip";
import MonoText from "./monoText";
import Link from "next/link";
import { useNode, useTheme } from "utils/hooks";
import IdentityLink from "./account/identityLink";
import { fetchIdentity } from "services/identity";
import { useEffect, useState } from "react";
import { nodes } from "utils/constants";
import {isNoIdentity} from "utils";

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
    setIdentity(null);
    fetchIdentity(relayChain, address).then(identity => setIdentity(identity));
  }, [relayChain, address]);

  const styledLink = (
    <StyledLink themecolor={theme.color} cursor={to ? "true" : "false"}>
      {address}
    </StyledLink>
  );

  if (isNoIdentity(identity)) {
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
      {identity && <b>
        {identity?.info?.displayParent ? `${identity?.info?.displayParent}/`:''}{identity?.info?.display}
        <br/>
      </b>}
      {address}
    </span>
  );

  const identityLink = <IdentityLink identity={identity} width={"auto"} cursor={to ? "true" : "false"} />;

  return (
    <Tooltip content={identityDisplay} isCopy copyText={address}>
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
