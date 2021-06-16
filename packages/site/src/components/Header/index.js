import styled, { css } from "styled-components";

import NodeSwitcher from "components/NodeSwitcher";
import { useHomePage } from "utils/hooks";
import Subheader from "./Subheader";

const Container = styled.header`
  position: relative;
  padding: 0 2rem;
`;

const Wrapper = styled.div`
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Background = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  z-index: -1;
  height: 320px;
  background: linear-gradient(180deg, #eeeeee 0%, #ffffff 100%);
  ${(p) =>
    p.isHomePage &&
    css`
      height: 464px;
      /* background: url("/imgs/pattern-dot.svg"),
        linear-gradient(180deg, #eeeeee 0%, #ffffff 100%); */
    `}
`;

export default function Header() {
  const isHomePage = useHomePage();
  return (
    <>
      <Container>
        <Background isHomePage={isHomePage} />
        <Wrapper>
          <img src="/imgs/logo.svg" alt="logo" />
          <NodeSwitcher />
        </Wrapper>
      </Container>
      {isHomePage && <Subheader />}
    </>
  );
}
