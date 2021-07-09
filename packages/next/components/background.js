import styled, { css } from "styled-components";

import { useHomePage } from "utils/hooks";

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
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
  opacity: 0.8;
  position: relative;
  top: -8px;
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

export default function Background() {
  const isHomePage = useHomePage();

  return (
    <Wrapper isHomePage={isHomePage}>
      <Masked />
    </Wrapper>
  );
}
