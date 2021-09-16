import styled from "styled-components";
import IdentityIcon from "./identityIcon";
import MonoText from "../monoText";

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


const Display = styled.span`
  margin-right: 8px;
`;

export default function Identity({ identity }) {
  if (!identity || identity?.status === 'NO_ID') {
    return null;
  }

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
    </Wrapper>
  );
}
