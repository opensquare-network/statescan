import styled, { css } from "styled-components";

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
  // todo make a better scroll bar
  //overflow-y: scroll;
  margin-left: 0 !important;
  top: 53px;
  left: 0;
  width: 480px;
  max-height: 308px;
  position: absolute;
`;

const ExploreHint = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  padding: 0 16px 0 16px;
  line-height: 48px;
  background-color: #ffffff;
  font-size: 15px;

  svg,
  img {
    margin-right: 8px;
  }

  * {
    margin: 0;
  }

  :hover {
    background-color: #fafafa;
  }
`;

const Token = styled.span`
  margin-right: 8px;
  overflow: hidden;
  width: 48px;
  font-weight: 500;
  color: #111111;
`;

const TokenDesc = styled.span`
  width: 299px;
  margin-right: 8px;
  overflow: hidden;
  color: rgba(17, 17, 17, 0.35);
`;

const Height = styled.span`
  color: rgba(17, 17, 17, 0.65);
`;

export default function SearchL({ hints = [], node }) {
  if (hints.length === 0) {
    return null;
  }
  return (
    <ExploreWrapper>
      <ExploreInput placeholder="Address / Transaction / Asset..." />
      <ExploreButton node={node}>Explore</ExploreButton>
      <ExploreHintsWrapper>
        {hints.map((hint) => (
          <ExploreHint>
            <img src="/imgs/token-icons/osn.svg" alt="icon" />
            <Token>OSN</Token>
            <TokenDesc>OpenSquare</TokenDesc>
            <Height>#12450</Height>
          </ExploreHint>
        ))}
      </ExploreHintsWrapper>
    </ExploreWrapper>
  );
}
