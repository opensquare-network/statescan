import styled, { css } from "styled-components";

import NodeSwitcher from "components/NodeSwitcher";
import { useHomePage } from "utils/hooks";
import Subheader from "./Subheader";
import { Link } from "react-router-dom";
import SearchS from "../Search/search-s";
import { useNode } from "utils/hooks";

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
    `};
`;

const Masked = styled.div`
  width: 100%;
  height: 100%;
  background: radial-gradient(
    39.66% 101.89% at 50.29% 24.73%,
    rgba(255, 255, 255, 0) 0%,
    rgba(221, 221, 221, 0.32) 100%
  );
  -webkit-mask-image: url("/imgs/pattern-dot.svg");
  mask-image: url("/imgs/pattern-dot.svg");
  -webkit-mask-repeat: repeat;
  mask-repeat: repeat;
`;

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default function Header() {
  const node = useNode();
  const isHomePage = useHomePage();

  return (
    <>
      <Container>
        <Background isHomePage={isHomePage}>
          <Masked />
        </Background>
        <Wrapper>
          <Link to={`/${node}`}>
            <img src="/imgs/logo.svg" alt="logo" />
          </Link>
          <RightWrapper>
            <SearchS />
            <NodeSwitcher />
          </RightWrapper>
        </Wrapper>
      </Container>
      {isHomePage && <Subheader />}
    </>
  );
}
