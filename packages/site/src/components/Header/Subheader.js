import styled, { css } from "styled-components";

import { useNode } from "utils/hooks";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 32px 32px;
  > :not(:first-child) {
    margin-top: 32px;
  }
  @media screen and (max-width: 900px) {
    padding: 16px 32px 16px;
  }
`;

const Logo = styled.img`
  width: 120px;
  height: 120px;
  @media screen and (max-width: 900px) {
    width: 100px;
    height: 100px;
  }
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 32px;
  line-height: 32px;
  color: #111111;
  margin: 0;
  white-space: nowrap;
  @media screen and (max-width: 900px) {
    font-size: 24px;
    line-height: 24px;
  }
`;

const ExploreWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 32px;
  }
  @media screen and (max-width: 900px) {
    flex-direction: column;
    max-width: 318px;
    width: 100%;
    > * {
      width: 100% !important;
    }
    > :not(:first-child) {
      margin: 16px 0 0;
    }
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
  text-align: center;
  cursor: pointer;
  ${(p) =>
    p.node === "kusama" &&
    css`
      background: #000000;
    `}
`;

export default function Subheader() {
  const node = useNode();

  return (
    <Wrapper>
      <Logo
        src={
          node === "kusama"
            ? "/imgs/logo-img-kusama.svg"
            : "/imgs/logo-img-polkadot.svg"
        }
        alt="logo"
      />
      <Title>Statemint Explorer</Title>
      <ExploreWrapper>
        <ExploreInput placeholder="Address / Transaction / Asset..." />
        <ExploreButton node={node}>Explore</ExploreButton>
      </ExploreWrapper>
    </Wrapper>
  );
}
