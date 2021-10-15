import styled from "styled-components";

import { useHomePage } from "utils/hooks";

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 320px;
  background: #ffffff;
`;

const Masked = styled.div`
  width: 100%;
  height: 100%;
  opacity: 0.8;
  position: relative;
  top: -8px;
  background: radial-gradient(
    87.94% 100% at 50% 100%,
    #f1f1f1 0%,
    #fafafa 64.58%,
    #ffffff 100%
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
