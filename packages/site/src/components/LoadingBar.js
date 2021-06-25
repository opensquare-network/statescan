import React from "react";
import styled, { keyframes } from "styled-components";

const animation = keyframes`
  0%   {background-color: #FAFAFA;}
  50%  {background-color: #F4F4F4;}
  100% {background-color: #FAFAFA;}
`;

const Wrapper = styled.div`
  width: ${(p) => p.percent};
  background: #fafafa;
  border-radius: 4px;
  height: 20px;
  animation-name: ${animation};
  animation-duration: 3s;
  animation-iteration-count: infinite;
  flex-shrink: 1;
`;

function LoadingBar({ random }) {
  let percent = "100%";
  if (random) {
    percent = 2 + Math.ceil(Math.random() * 8) + "0%";
  }

  return <Wrapper percent={percent} />;
}

export default React.memo(LoadingBar);
