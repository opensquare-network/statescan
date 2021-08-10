import styled from "styled-components";
import IdentityIcon from "./identityIcon";
import Polkascan from "../../public/imgs/icons/identity/polkascan.svg";
import PolkascanGrey from "../../public/imgs/icons/identity/polkascan-grey.svg";
import Subscan from "../../public/imgs/icons/identity/subscan.svg";
import SubscanGrey from "../../public/imgs/icons/identity/subscan-grey.svg";

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

export default function Identity({ identity }) {
  if (!identity) {
    return null;
  }

  const displayName = identity?.info?.displayParent
    ? `${identity?.info?.displayParent}/${identity?.info?.display}`
    : identity?.info?.display;

  return (
    <Wrapper>
      <IdentityIcon />
      {displayName}
      <Source
        href={`https://polkascan.io/polkadot/account/${identity.address}`}
        target="_blank"
        title="polkascan"
      >
        <PolkascanGrey className="hover-hide" />
        <Polkascan className="hover-show" />
      </Source>
      <Source
        href={`https://polkadot.subscan.io/account/${identity.address}`}
        target="_blank"
        title="subascan"
      >
        <SubscanGrey className="hover-hide" />
        <Subscan className="hover-show" />
      </Source>
    </Wrapper>
  );
}
