import styled from "styled-components";
import AuthIcon from "../../public/imgs/icons/identity/auth.svg";
import SubIcon from "../../public/imgs/icons/identity/sub.svg";
import ErrorIcon from "../../public/imgs/icons/identity/error.svg";
import UnauthorizedIcon from "../../public/imgs/icons/identity/error-grey.svg";
import SubGreyIcon from "../../public/imgs/icons/identity/sub-grey.svg";
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
  const statusIconMap = new Map([
    ["authorized", AuthIcon],
    ["authorized-sub", SubIcon],
    ["error", ErrorIcon],
    ["unauthorized", UnauthorizedIcon],
    ["unauthorized-sub", SubGreyIcon],
  ]);

  const judgements = identity?.info?.judgements ?? [];

  const isAuthorized = judgements.some(
    ([, judgement]) => judgement.isKnownGood || judgement.isReasonable
  );

  const isBad = judgements.some(
    ([, judgement]) => judgement.isErroneous || judgement.isLowQuality
  );

  const displayName = identity?.info?.displayParent
    ? `${identity?.info?.displayParent}/${identity?.info?.display}`
    : identity?.info?.display;

  let status = "unauthorized";

  if (isAuthorized && !identity?.info?.displayParent) {
    status = "authorized";
    if (identity?.info?.displayParent) {
      status += "-sub";
    }
  }

  if (isBad) {
    status = "error";
    if (identity?.info?.displayParent) {
      status += "-sub";
    }
  }

  const StatusIcon = statusIconMap.get(status) ?? ErrorIcon;
  return (
    <Wrapper>
      <StatusIcon />
      {displayName}
      <Source href="" target="_blank" title="polkascan">
        <PolkascanGrey className="hover-hide" />
        <Polkascan className="hover-show" />
      </Source>
      <Source href="" target="_blank" title="subascan">
        <SubscanGrey className="hover-hide" />
        <Subscan className="hover-show" />
      </Source>
    </Wrapper>
  );
}
