import styled from "styled-components";
import IdentityIcon from "./identityIcon";
import Polkascan from "../../public/imgs/icons/identity/polkascan.svg";
import PolkascanGrey from "../../public/imgs/icons/identity/polkascan-grey.svg";
import Subscan from "../../public/imgs/icons/identity/subscan.svg";
import SubscanGrey from "../../public/imgs/icons/identity/subscan-grey.svg";
import MonoText from "../monoText";
import { useNode } from "../../utils/hooks";
import { nodes } from "utils/constants";

const Wrapper = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;

  svg {
    margin-right: 8px;
  }

  a {
    width: 20px;
    height: 20px;
    margin-left: 8px;
  }

  color: #111;
  font-weight: 500;
`;

const Source = styled.a`
  svg {
    margin: 0 !important;
  }

  .hover-show {
    display: none;
  }

  &:hover {
    .hover-hide {
      display: none;
    }

    .hover-show {
      display: initial;
    }
  }
`;

const Display = styled.span`
  margin-right: 8px;
`;

export default function Identity({ identity }) {
  if (!identity) {
    return null;
  }
  const node = useNode();
  const relayChain =
    nodes.find((item) => item.value === node)?.sub?.toLowerCase() || "kusama";

  const displayName = identity?.info?.displayParent
    ? `${identity?.info?.displayParent}/${identity?.info?.display}`
    : identity?.info?.display;

  return (
    <Wrapper>
      <IdentityIcon identity={identity} />
      <Display>
        {" "}
        <MonoText>{displayName}</MonoText>{" "}
      </Display>
      {relayChain === "kusama" && (
        <Source
          href={`https://polkascan.io/kusama/account/${identity.address}`}
          target="_blank"
          title="polkascan"
        >
          <PolkascanGrey className="hover-hide" />
          <Polkascan className="hover-show" />
        </Source>
      )}
      {relayChain === "westend" && (
        <Source
          href={`https://westend.subscan.io/account/${identity.address}`}
          target="_blank"
          title="subascan"
        >
          <SubscanGrey className="hover-hide" />
          <Subscan className="hover-show" />
        </Source>
      )}
    </Wrapper>
  );
}
