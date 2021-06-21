import styled, { css } from "styled-components";

import { useNode } from "utils/hooks";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 32px 16px;

  > :not(:first-child) {
    margin-top: 32px;
  }

  @media screen and (max-width: 900px) {
    padding: 16px 32px 8px;
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
  position: relative;
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

  :active,
  :focus {
    background-color: #ffffff;
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

const ExploreHintsWrapper = styled.div`
  margin-left: 0 !important;
  top: 53px;
  left: 0;
  width: 480px;
  border: 1px solid #000;
  position: absolute;
`;

const ExploreHint = styled.div`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0 16px 0 16px;
  line-height: 48px;

  * {
    margin: 0;
  }

  :hover {
    background-color: #fafafa;
  }
`;

const Token = styled.span``;

const TokenDesc = styled.span``;

const Height = styled.span``;

export default function Subheader() {
  const node = useNode();
  const hints = [1, 2, 3, 4, 5];
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
        <ExploreHintsWrapper>
          {hints.map((hint) => (
            <ExploreHint>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="12" fill="url(#paint0_linear)" />
                <path
                  d="M16.1574 12L13.5591 10.5L16.677 8.7L20.9642 11.175V12.825L16.677 15.3L13.5591 13.5L16.1574 12Z"
                  fill="white"
                />
                <path
                  d="M10.4411 13.5L7.84281 12L10.4411 10.5L7.32315 8.7L3.03595 11.175V12.825L7.32315 15.3L10.4411 13.5Z"
                  fill="white"
                />
                <path
                  d="M12.0001 15L14.5984 16.5L12.0001 18L9.40179 16.5L12.0001 15Z"
                  fill="white"
                />
                <path
                  d="M14.5984 7.5L12.0001 6L9.40179 7.5L12.0001 9L14.5984 7.5Z"
                  fill="white"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="24"
                    y1="2.14614e-06"
                    x2="5.00716e-06"
                    y2="24"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#04D2C5" />
                    <stop offset="1" stop-color="#6848FF" />
                  </linearGradient>
                </defs>
              </svg>
              <Token>OSN</Token>
              <TokenDesc>OpenSquare</TokenDesc>
              <Height>#12450</Height>
            </ExploreHint>
          ))}
        </ExploreHintsWrapper>
      </ExploreWrapper>
    </Wrapper>
  );
}
