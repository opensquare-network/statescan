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
  if (!identity || identity?.info?.status === "NO_ID") {
    return null;
  }

  return (
    <Wrapper>
      <IdentityIcon identity={identity} />
      <Display>
        <MonoText>{identity?.info?.display}</MonoText>{" "}
      </Display>
    </Wrapper>
  );
}
