import { useState, useEffect } from "react";
import styled, { css } from "styled-components";

import NodeSwitcher from "components/NodeSwitcher";
import { useHomePage, useNode } from "utils/hooks";
import Subheader from "./Subheader";
import { nodes } from "utils/constants";

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
  const node = useNode();
  const [logo, setLogo] = useState();
  useEffect(() => {
    setLogo(nodes.find((item) => item.value === node)?.logo);
  }, [node]);

  return (
    <>
      <Container>
        <Background isHomePage={isHomePage} />
        <Wrapper>
          <img src={logo} alt="logo" />
          <NodeSwitcher />
        </Wrapper>
      </Container>
      {isHomePage && <Subheader />}
    </>
  );
}
