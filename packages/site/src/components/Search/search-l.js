import styled, { css } from "styled-components";
import { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

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
  cursor: pointer;
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

export default function SearchL({ node }) {
  const [redirect, setRedirect] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [assets, setHintAssets] = useState([]);
  const [focus, setFocus] = useState(false);

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  const onInput = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    //todo debounce this
    axios.get(`/westmint/search/autocomplete?prefix=${value}`).then((res) => {
      setHintAssets(res.data.assets || []);
    });
  };
  return (
    <ExploreWrapper>
      <ExploreInput
        value={searchKeyword}
        onChange={onInput}
        placeholder="Address / Transaction / Asset..."
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(false), 100)}
      />
      <ExploreButton node={node}>Explore</ExploreButton>
      {focus && (
        <ExploreHintsWrapper>
          {assets.map((hint) => (
            <ExploreHint
              onClick={() => {
                setRedirect(
                  `/westmint/asset/${hint.assetId}_${hint.createdAt?.blockHeight}`
                );
              }}
            >
              <img
                src={`/imgs/token-icons/${hint.symbol.toLowerCase()}.svg`}
                alt=""
              />
              <Token>{hint.symbol}</Token>
              <TokenDesc>{hint.name}</TokenDesc>
              <Height>#{hint.createdAt.blockHeight}</Height>
            </ExploreHint>
          ))}
        </ExploreHintsWrapper>
      )}
    </ExploreWrapper>
  );
}
