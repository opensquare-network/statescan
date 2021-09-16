import styled, { css } from "styled-components";
import IdentityIcon from "./identityIcon";
import {isNoIdentity} from "utils";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  ${(p) =>
    p.cursor === "true" &&
    css`
      cursor: pointer;
    `}

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
  ${p => p.width
    ? css`width: ${p.width};`
    : css`max-width: 86px;`
  }
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  color: #111111;
`;

export default function IdentityLink({ identity, cursor, width }) {
  if (isNoIdentity(identity)) {
    return null;
  }

  const displayName = identity?.info?.displayParent
    ? `${identity?.info?.displayParent}/${identity?.info?.display}`
    : identity?.info?.display;

  return (
    <Wrapper cursor={cursor}>
      <IdentityIcon identity={identity} />
      <Display width={width}>{displayName}</Display>
    </Wrapper>
  );
}
