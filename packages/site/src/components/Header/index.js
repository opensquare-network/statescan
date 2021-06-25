import styled, { css } from "styled-components";

import NodeSwitcher from "components/NodeSwitcher";
import { useHomePage } from "utils/hooks";
import Subheader from "./Subheader";
import { Link } from "react-router-dom";

const Container = styled.header`
  position: relative;
  padding: 0 2rem;
  @media screen and (max-width: 1200px) {
    padding: 0 1.5rem;
  }
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
          <Link to="/">
            <img src="/imgs/logo.svg" alt="logo" />
          </Link>
          <NodeSwitcher />
        </Wrapper>
      </Container>
      {isHomePage && <Subheader />}
    </>
  );
}
