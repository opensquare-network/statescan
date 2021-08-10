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
  overflow: hidden;
  text-overflow: ellipsis;

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
  display: inline-block;
  width: 86px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  color: #111111;
`;

export default function IdentityLink({ identity }) {
  const statusIconMap = new Map([
    ["authorized", AuthIcon],
    ["sub", SubIcon],
    ["error", ErrorIcon],
    ["unauthorized", UnauthorizedIcon],
    ["unauthorized-sub", SubGreyIcon],
  ]);
  const Status = statusIconMap.get(identity?.status) ?? ErrorIcon;
  return (
    <Wrapper>
      <Status />
      <Display>{identity?.info?.display}&nbsp;</Display>
      {/*{identity.source && (*/}
      {/*<Source href="" target="_blank" title="polkascan">*/}
      {/*  <PolkascanGrey className="hover-hide"/>*/}
      {/*  <Polkascan className="hover-show"/>*/}
      {/*</Source>*/}
      {/*<Source href="" target="_blank" title="subascan">*/}
      {/*  <SubscanGrey className="hover-hide"/>*/}
      {/*  <Subscan className="hover-show"/>*/}
      {/*</Source>*/}
      {/*)}*/}
    </Wrapper>
  );
}
