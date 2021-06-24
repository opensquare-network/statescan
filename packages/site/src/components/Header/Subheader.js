import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useNode } from "utils/hooks";
import { nodes } from "utils/constants";

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

export default function Subheader() {
  const node = useNode();
  const logo = node === "kusama" ? "kusama.svg" : "polkadot.svg";
  const [name, setName] = useState();

  useEffect(() => {
    setName(nodes.find((item) => item.value === node)?.name);
  }, [node]);

  return (
    <Wrapper>
      <Logo src={`/imgs/logo-img-${logo}`} alt="logo" />
      <Title>{name} Explorer</Title>
      <ExploreWrapper>
        <ExploreInput placeholder="Address / Transaction / Asset..." />
        <ExploreButton node={node}>Explore</ExploreButton>
      </ExploreWrapper>
    </Wrapper>
  );
}
