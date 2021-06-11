import styled, { css } from "styled-components";
import { useSelector } from "react-redux";

import { nodeSelector } from "store/reducers/nodeSlice";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  > :not(:first-child) {
    margin-top: 32px;
  }
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 32px;
  line-height: 32px;
  color: #111111;
  margin: 0;
`;

const ExploreWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 32px;
  }
`;

const ExploreInput = styled.input`
  width: 480px;
  padding: 12px 16px;
  background: #f4f4f4;
  border-radius: 8px;
  font-size: 16px;
  line-height: 20px;
  outline: none;
  border: none;
  ::placeholder {
    color: rgba(17, 17, 17, 0.35);
  }
`;

const ExploreButton = styled.div`
  background: #f22279;
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
  cursor: pointer;
  ${(p) =>
    p.node === "kusama" &&
    css`
      background: #000000;
    `}
`;

export default function Subheader() {
  const node = useSelector(nodeSelector);
  return (
    <Wrapper>
      <img
        src={
          node === "kusama"
            ? "/imgs/logo-img-kusama.svg"
            : "/imgs/logo-img-polkadot.svg"
        }
        alt="logo"
        width={120}
        height={120}
      />
      <Title>Statemint Explorer</Title>
      <ExploreWrapper>
        <ExploreInput placeholder="Address / Transaction / Asset..." />
        <ExploreButton node={node}>Explore</ExploreButton>
      </ExploreWrapper>
    </Wrapper>
  );
}
